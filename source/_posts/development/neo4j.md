---
title: Spring Data Neo4j 开发记录
date: 2022-02-22 15:52:15
tags:
  - Neo4j
  - Spring Boot
  - 后端
  - 科研
categories:
  - 我的开发
cover: source@/assets/covers/neo4j.svg
---

## 简介

由于课题涉及到了知识图谱，需要把企业制造资源信息以图的形式存储起来，因此打算采用 Neo4j 这个图数据库来实现。课题项目后端是使用 Spring Boot 开发的，Spring Data 中也恰好提供了 Neo4j 的 API。Sping Data Neo4j 的最新版本已经来到了 6.0+，而网上的相关教程大多都是 5.0 版本的，其中不免有许多版本差异，因此我主要参照[官方文档](https://docs.spring.io/spring-data/neo4j/docs/current/reference/html/#reference)进行开发，并且记录一下遇到的问题。

## 开发流程

### 节点实体类编写

Neo4j 中的一类节点对应 Java 语言中的一个类。

如下代码所示，是制造资源类型节点的实体映射类。

```java
@Node
@Data
@Builder
public class ResourceType {

    @Id
    @GeneratedValue
    private UUID uuid;

    @Property
    private String name;

    @Property
    private String description;

    @CreatedDate
    private Long createAt;

    @Relationship(type = "HAS_PRESET_PROPERTY", direction = Relationship.Direction.OUTGOING)
    private List<cn.imcao.ess.entity.resource.DO.Property> properties;
}
```

代码中的注解含义如下：

- @Node 注解表明这是一个 Neo4j 节点的实体类；
- @Id 是实体类的必需注解，表明被标记的属性是唯一标识符，也就是主键；
- @GeneratedValue 注解的存在可以让系统自动生成标识符，在创建对象时也就无需手动给该属性赋值；
- @Property 注解表明该属性即是节点的常规字段；
- @CreatedDate 注解可以让系统在对象被创建时自动打上时间戳，类似的还有 @CreatedBy, @LastModifiedBy, @LastModifiedDate 等注解有类似的作用，这也是 Sping Data 公共的注解，具体可查看[官方文档](https://docs.spring.io/spring-data/neo4j/docs/current/reference/html/#mapping.annotations.overview.from.commons)的详细说明。
- @Relationship 注解可以为两类节点添加关系，上述代码为 ResourceType 到 Property 创建了名为 `HAS_PRESET_PROPERTY` 的关系，其中 Property 是另一类节点的实体类，意为“制造资源类型具有某些预设属性”。

需要注意的是，@Relationship 需要指定 direction 来表明关系的方向，可选值有 `Relationship.Direction.OUTGOING` 和 `Relationship.Direction.INCOMING`，分别代表从当前类指向属性所属的类和从属性所属的类指向当前类。

并且 @Relationship 只需在关系两方中的任意一方定义即可，即无需在 Property 类中再用 `INCOMING` 定义 `HAS_PRESET_PROPERTY` 的关系。由于在查询节点时会返回节点实体类的所有属性（包括关系），因此如果重复定义 @Relationship 会导致无限递归。

上述例子中定义的关系如下图所示，黄点代表制造资源类型，绿点代表属性。

![@Relationship 创建的关系](source@/_posts/development/neo4j/relationship.jpg)

### 关系实体类编写

在 Spring Data Neo4j 5.0 及之前的版本中，需要为每一类关系编写一个实体类，而不能像上文所述直接在节点实体类中用 @Relationship 来创建关系。这一项改动简化了一些简单关系的创建流程，而对于创建复杂关系（例如拥有属性的关系）来说，还是需要编写一个关系的实体类。

```java
@Node
@Data
@Builder
public class Resource {

    @Id
    @GeneratedValue
    private UUID uuid;

    @Property
    private String name;

    @Relationship(type = "HAS_PROPERTY", direction = Relationship.Direction.OUTGOING)
    private List<HasProperty> hasProperties;
}
```

上述代码创建了 Resource 的节点实体类，它拥有一个指向 HasProperty 名为 `HAS_PROPERTY` 的关系属性。而这里的 HasProperty 不同于上文，并非一个节点实体类，而是一个关系实体类，该类代码如下：

```java
@RelationshipProperties
@Data
@Builder
public class HasProperty {

    @RelationshipId
    private Long id;

    private String value;

    private String queryUrl;

    @LastModifiedDate
    private Long lastModifiedAt;

    @TargetNode
    private Property property;
}
```

之所以需要创建一个关系实体类，是因为这个关系拥有 value, queryUrl 等属性，类中的注解含义如下：

- @RelationshipProperties 类似于 @Node 表明这是一个关系实体类
- @RelationshipId 类似于 @Id，关系的唯一标识符
- @TargetNode 指定关系指向的节点实体类

因此，以上代码实际上创建了一个从 Resource 指向 Property 的关系，并且该关系拥有一些属性。

![复杂关系](source@/_posts/development/neo4j/relationship-domain.jpg)

### 继承 Neo4jRepository 接口

Neo4jRepository 就如同 Spring Data JPA 中的 JpaRepository 一样，已经帮我们实现很多诸如 save、delete、findAll、findOne、分页等功能，还能根据方法的名字和查询字符串自动生成可以直接调用的方法。

```java
public interface ResourceRepository extends Neo4jRepository<Resource, UUID> {

    List<Resource> findAllByName(String name);

    List<Resource> findAllByNameAndPrice(String name, Integer price);
}
```

在继承 Neo4jRepository 时需要指定要操作的节点类型和节点的唯一标识符。以上为实现 Resource 节点操作的 Repository，可以直接调用其 save, delete, findAll 等方法对节点进行操作，也可以在接口中拼接自定义的查询方法，例如上述代码中的 findAllByName 可以按 name 查找节点，具体方法拼接规则可参考[官方文档](https://docs.spring.io/spring-data/neo4j/docs/current/reference/html/#repository-query-keywords)。

### 服务创建

创建完 Repository 后就来到了 Spring Boot 的正常开发环节，创建 Service 层调用 Repository 并封装服务，创建 Controller 层调用 Service 实现数据解析和封装。

## CQL 查询语言

### 语法基础

CQL(Cypher Query Language) 是图数据库的查询语言，虽然语法与 SQL 差距很大，但其思想还有类似之处，可以参考 Neo4j 官方提供的[文档](https://neo4j.com/docs/cypher-manual/current/)进行学习，这里不再赘述。

### 在代码中使用 CQL

```java
public interface ResourceRepository extends Neo4jRepository<Resource, UUID> {

    @Query("match ()-[r:HAS_PROPERTY]->() " +
            "where id(r) = :#{#property.id} " +
            "set r.value = :#{#property.value}, " +
            "r.queryUrl = :#{#property.queryUrl}, " +
            "r.lastModifiedAt = :#{#property.lastModifiedAt} " +
            "RETURN r")
    void updateProperty(@Param("property") HasProperty hasProperty);

    @Query("MATCH (ResourceType{uuid: $uuid})-[:HAS_RESOURCE]->(n:Resource) RETURN n")
    List<Resource> findAllByType(@Param("uuid") String uuid);
}
```

如上代码所示，在 Repository 中可以使用 @Query 注解来为某一方法指定查询 CQL，方法可以传入基本类型参数或者对象参数，并以 `$` 或 `:#{}` 获取参数的值。

需要注意的是，使用 Repository 自动生成的 FindAll 方法可以查询到节点以及与节点有关系的更深层的节点，即返回的是一个完整的树形结构（在节点实体类编写一节中曾提到），而使用 CQL 实现时需要通过 collect(n) 来实现，代码如下：

```java
public interface ResourceTypeRepository extends Neo4jRepository<ResourceType, UUID> {

    @Query(value = "MATCH (:Enterprise{enterpriseId:$enterpriseId})-[:HAS_RESOURCE_TYPE]->(n:ResourceType) " +
            "WHERE n.name CONTAINS $name AND n.tag CONTAINS $tag AND n.type CONTAINS $type " +
            "OPTIONAL MATCH (n)-[r]->(m:Property) " +
            "RETURN n, collect(r), collect(m) :#{orderBy(#pageable)} SKIP $skip LIMIT $limit")
    Page<ResourceType> queryPage(@Param("enterpriseId") Integer enterpriseId,
                                 @Param("name") String name,
                                 @Param("tag") String tag,
                                 @Param("type") String type,
                                 Pageable pageable);
}
```

上述代码中也展示了分页功能的使用，通过 Pageable 对象来定制分页规则，并且可以在 CQL 中提取 pageable（用于排序）、skip 和 limit 变量。

其中 pageable 作为排序参数需要提前指定排序方法，例如：

```java
Sort sort = Sort.by("n.name").ascending();
PageRequest pageRequest = PageRequest.of(0, 5, sort);
```

这里需要注意一个问题：Sort里 `n.name` 的 `n` 需要与 CQL 中 `RETURN n` 中的 `n` 相呼应，这就需要在写排序规则和 CQL 时都考虑这个问题，我觉得这是一个设计的不合理之处，但是人家开发人员也说了，就是这么用的，甚至搬出了实例代码的用法，咱也只能照做了，参考 spring-data-neo4j [issue#2460](https://github.com/spring-projects/spring-data-neo4j/issues/2460)。