# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# react-native-agora
-keep class io.agora.**{*;}

# react-native-fast-image
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

# aliPay
-keep class com.alipay.** { *; }


# gson
-dontwarn com.google.**
-keep class com.google.gson.** {*;}

# protobuf
-keep class com.google.protobuf.** {*;}

# aliOnePass
-keep class cn.com.chinatelecom.gateway.lib.** {*;}
-keep class com.unicom.xiaowo.login.** {*;}
-keep class com.cmic.sso.sdk.** {*;}
-keep class com.mobile.auth.** {*;}
-keep class android.support.v4.** { *;}
-keep class org.json.**{*;}
-keep class com.alibaba.fastjson.** {*;}

# aliOSS
-keep class com.alibaba.sdk.android.oss.** { *; }
-dontwarn okio.**
-dontwarn org.apache.commons.codec.binary.**

# wechat
-keep class com.tencent.mm.sdk.modelmsg.WXMediaMessage { ;}
-keep class com.tencent.mm.sdk.modelmsg.* implements com.tencent.mm.sdk.modelmsg.WXMediaMessage$IMediaObject {;}
-dontwarn com.tencent.mm.**
-keep class com.tencent.mm.**{;}
