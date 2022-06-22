---
title: Spring Boot 自动配置原理
date: 2021-11-01
tags:
  - Spring Boot
categories:
  - 我的开发
cover: SpringBootAutoConfiguration.png
---

## 注解分析

@SpringBootApplication 是 Sprnig Boot 项目的核心注解，目的是开启自动配置。它一般作用于 Spring Boot 应用的启动类上，主要由 @ComponentScan，@SpringBootConfiguration 和 @EnableAutoConfiguration 三个注解合成而来。以下展示了 @SpringBootApplication 注解的层次关系，接下来将详细讲解每个注解的作用。

```txt
@SpringBootApplication
├── @ComponentScan
├── @SpringBootConfiguration
│   └── @Configuration
└── @EnableAutoConfiguration
    ├── @Import(AutoConfigurationImportSelector.class)
    └── @AutoConfigurationPackage
        └── @Import(AutoConfigurationPackages.Registrar.class)
```

## @ComponentScan

```java
@ComponentScan(excludeFilters = {
  @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
  @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class)
})
```

@ComponentScan 用于实现自动扫描组件并将其添加到 IoC 容器中。

可以通过 basePackages 属性来指定自动扫描的包路径，不指定时默认在 @ComponentScan 所在类的包下进行扫描，因此 Spring Boot 启动类所属包下的所有类都能被扫描。

@SpringBootApplication 中的 @ComponentScan 还利用 excludeFilters 属性排除了对 TypeExcludeFilter 和 AutoConfigurationExcludeFilter 两个类的扫描。

## @SpringBootConfiguration

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documenteds
@Configuration
@Indexed
public @interface SpringBootConfiguration {
	@AliasFor(annotation = Configuration.class)
	boolean proxyBeanMethods() default true;
}
```

@SpringBootConfiguration 本质上就是 @Configuration，它可将当前类标注为配置类，并会将当前类内声明的带有 @Bean 注解的方法注册到容器中，其实例名为方法名，类型为方法返回类型。

## @EnableAutoConfigurations

@EnableAutoConfigurations 是实现自动配置的关键注解，主要由 @AutoConfigurationPackage 和 @Import(AutoConfigurationImportSelector.class) 两个注解合成，以下将分别讲解两个注解的作用。

### @AutoConfigurationPackage

该注解包含 @Import(AutoConfigurationPackages.Registrar.class)，其功能是将 Registrar 类注册到容器中，该类通过调用 register 方法可将包路径下所有带有 @Bean 注解的方法注册到组件中。

简单来讲，就是将用户自己写的 @Bean 注册到容器中。

```java
static class Registrar implements ImportBeanDefinitionRegistrar, DeterminableImports {

  @Override
  public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
    register(registry, new PackageImports(metadata).getPackageNames().toArray(new String[0]));
  }
}

public static void register(BeanDefinitionRegistry registry, String... packageNames) {
  if (registry.containsBeanDefinition(BEAN)) {
    BasePackagesBeanDefinition beanDefinition = (BasePackagesBeanDefinition) registry.getBeanDefinition(BEAN);
    beanDefinition.addBasePackages(packageNames);
  }
  else {
    registry.registerBeanDefinition(BEAN, new BasePackagesBeanDefinition(packageNames));
  }
}
```

### @Import(AutoConfigurationImportSelector.class)

该注解是真正实现自动配置的注解，它将 AutoConfigurationImportSelector 类注册到容器中，目的是批量向容器中注册组件。

AutoConfigurationImportSelector 实现了 ImportSelector 接口，其中只需实现 selectImports 方法，并以数组的形式返回要导入的类名，即可实现批量注册组件。

AutoConfigurationImportSelector 类中通过调用 getAutoConfigurationEntry 方法来获取 Spring Boot 需要自动配置的类名

```java
@Override
public String[] selectImports(AnnotationMetadata annotationMetadata) {
  if (!isEnabled(annotationMetadata)) {
    return NO_IMPORTS;
  }
  AutoConfigurationEntry autoConfigurationEntry = getAutoConfigurationEntry(annotationMetadata);
  return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());
}

protected AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {
  if (!isEnabled(annotationMetadata)) {
    return EMPTY_ENTRY;
  }
  AnnotationAttributes attributes = getAttributes(annotationMetadata);
  List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
  configurations = removeDuplicates(configurations);
  Set<String> exclusions = getExclusions(annotationMetadata, attributes);
  checkExcludedClasses(configurations, exclusions);
  configurations.removeAll(exclusions);
  configurations = getConfigurationClassFilter().filter(configurations);
  fireAutoConfigurationImportEvents(configurations, exclusions);
  return new AutoConfigurationEntry(configurations, exclusions);
}
```

通过 Debug 模式可以看到，在 Spring Boot 应用启动时会自动从 META-INF/spring.factories 中获取需要自动注册的配置类，当前项目共 131 个。这 131 个配置类存在于 org.springframework.boot.autoconfigure 包下，并都以 XXXAutoConfiguration 命名。

![configuration](source@/config.png)

## 自动配置条件

在 Debug 模式下，可以获取最终自动配置的所有类，发现从全部的 131 个减少到了 24 个。

![filter](source@/filter.png)

这是因为 Spring Boot 将相应功能模块未开启的配置类筛选掉了，返回了真正需要自动配置的类名。

例如，在 WebMvcAutoConfiguration 类上存在 @ConditionalOnXXX 注解，该类注解作为配置类生效的条件。依然以 WebMvcAutoConfiguration 为例，只有在 Web 类型为 SERVLET（而非 REACTIVE）；Servlet、DispatcherServlet、WebMvcConfigurer 类都存在；容器中没有 WebMvcConfigurationSupport 类型的 Bean 时，该配置类才会生效。如果没有导入 Spring Web 的依赖，那么 DispatcherServlet 类就不存在，配置类也就不起作用，自动配置时就会把 WebMvcAutoConfiguration 筛选掉。

```java
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass({ Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class })
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)
public class WebMvcAutoConfiguration {
}
```

## ConfigurationProperties

在对 Spring Boot 应用进行配置时，只需在 application.properties 或 application.yml 中填写相应的配置项，即可实现对配置类的修改，其背后的逻辑是利用 ConfigurationProperties 将配置类与配置文件前缀进行绑定，以下用 DataSource 的配置举例说明。

在配置数据源时通常需要有以下配置

```yml
spring:
  datasource:
    url: jdbc:mysql://101.37.23.44:3306/demo
    username: demo
    password: demo
    driver-class-name: com.mysql.cj.jdbc.Driver
```

而在 Spring 源码中有与配置项对应的类名为 DataSourceProperties，该类通过 @ConfigurationProperties(prefix = "spring.datasource") 注解将其绑定到配置文件中 spring.datasource 的配置项上。

```java
@ConfigurationProperties(prefix = "spring.datasource")
public class DataSourceProperties implements BeanClassLoaderAware, InitializingBean {

	private String driverClassName;
	private String url;
	private String username;
	private String password;
  // ………
}
```

在 DataSourceAutoConfiguration 自动配置类中又通过注解 @EnableConfigurationProperties(DataSourceProperties.class) 开启上述类与自动配置类的绑定。

```java
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
}
```

这样一来，在之后的自动配置阶段 Spring Boot 自动注册到容器中的 DataSourceAutoConfiguration 就会带上配置文件中的信息了。
