---
title: 一个导致鸿蒙系统用户态被打穿的路径遍历漏洞分析
date: 2025-12-28 21:57
tags:
  - 鸿蒙
categories:
  - 我的开发
---

https://gitcode.com/openharmony/bundlemanager_bundle_framework/pull/10480

先来看一段代码

```cpp
bool InstalldOperator::ExtractFiles(const std::string hnpPackageInfo, const ExtractParam &extractParam)
{
    std::map<std::string, std::string> hnpPackageInfoMap;	
    std::stringstream hnpPackageInfoString(hnpPackageInfo);
    std::string keyValue;
    while (getline(hnpPackageInfoString, keyValue, '}')) {
        size_t pos = keyValue.find(":");
        if (pos != std::string::npos) {
            std::string key = keyValue.substr(1, pos - 1);
            std::string value = keyValue.substr(pos + 1);
            hnpPackageInfoMap[key] = value;
        }
    }

    BundleExtractor extractor(extractParam.srcPath);
    if (!extractor.Init()) {
        LOG_E(BMS_TAG_INSTALLD, "extractor init failed");
        return false;
    }

    std::vector<std::string> entryNames;
    if (!extractor.GetZipFileNames(entryNames) || entryNames.empty()) {
        LOG_E(BMS_TAG_INSTALLD, "get entryNames failed");
        return false;
    }
    std::string targetPathAndName = "";
    for (const auto &entryName : entryNames) {
        if (strcmp(entryName.c_str(), ".") == 0 ||
            strcmp(entryName.c_str(), "..") == 0) {
                continue;
        }
        if (entryName.back() == ServiceConstants::PATH_SEPARATOR[0]) {
            continue;
        }
        // handle native file
        if (IsNativeFile(entryName, extractParam)) {
            std::string prefix;

            if (!DeterminePrefix(extractParam.extractFileType, extractParam.cpuAbi, prefix)) {
                LOG_E(BMS_TAG_INSTALLD, "determine prefix failed");
                return false;
            }

            std::string targetName = entryName.substr(prefix.length());
            if (hnpPackageInfoMap.find(targetName) == hnpPackageInfoMap.end()) {
                LOG_E(BMS_TAG_INSTALLD, "illegal native bundle");
                continue;
            }
            targetPathAndName = extractParam.targetPath + hnpPackageInfoMap[targetName]
                                + ServiceConstants::PATH_SEPARATOR + targetName;
            ExtractTargetHnpFile(extractor, entryName, targetPathAndName, extractParam.extractFileType);
            hnpPackageInfoMap.erase(targetName);
            continue;
        }
    }

    if (hnpPackageInfoMap.size() > 0) {
        return false;
    }
    LOG_D(BMS_TAG_INSTALLD, "InstalldOperator::ExtractFiles end");
    return true;
}
```