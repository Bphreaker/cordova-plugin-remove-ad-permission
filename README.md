# cordova-plugin-remove-ad-permission
Cordova Plugin to remove Android AD Permission from app manifest


Advertising ID
If your app uses the IMA SDK version 3.25.1 or higher, the SDK already automatically declares the com.google.android.gms.permission.AD_ID permission and is able to access the Advertising ID whenever it's available.
Link: https://developers.google.com/interactive-media-ads/docs/sdks/android/dai/android-12

Changes AndroidManifest.xml to disable auto backup by setting android:allowBackup to false.

Installation
By default adding this plugin to your cordova-android project will remove the com.google.android.gms.permission.AD_ID permission from Application AndroidManifest.xml file.

cordova plugin add https://github.com/Bphreaker/cordova-plugin-remove-ad-permission.git
