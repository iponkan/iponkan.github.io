---
title: Android 获取唯一标识
date: 2017-01-19
categories: Android
tags: Android
---

有时需要对用户设备进行标识，所以希望能够得到一个稳定可靠并且唯一的识别码。虽然Android系统中提供了这样设备识别码，但是由于Android系统版本、厂商定制系统中的Bug等限制，稳定性和唯一性并不理想。而通过其他硬件信息标识也因为系统版本、手机硬件等限制存在不同程度的问题。

<!-- more -->

## DEVICE ID

在以前，我们的Android设备是手机，这个DEVICE ID可以通过TelephonyManager.getDeviceId()获取，它根据不同的手机设备返回IMEI，MEID或者ESN码，但它在使用的过程中会遇到很多问题：

1. 非手机设备： 如果只带有Wifi的设备或者音乐播放器没有通话的硬件功能的话就没有这个DEVICE_ID
2. 权限： 获取DEVICE_ID需要READ_PHONE_STATE权限，但如果我们只为了获取它，没有用到其他的通话功能，那这个权限有点大才小用
3. bug：在少数的一些手机设备上，该实现有漏洞，会返回垃圾，如:zeros(全是0)或者asterisks(星号)的产品 MAC ADDRESS我们也可以通过手机的Wifi或者蓝牙设备获取MAC ADDRESS作为DEVICE ID，但是并不建议这么做，因为:

  1. 硬件限制：并不是所有的设备都有Wifi和蓝牙硬件，硬件不存在自然也就得不到这一信息。
  2. 获取的限制：如果Wifi没有打开过，是无法获取其Mac地址的；而蓝牙是只有在打开的时候才能获取到其Mac地址。

## Serial Number

在Android 2.3以后可以通过android.os.Build.SERIAL获取，非手机设备可以通过该接口获取。没有电话功能的设备被要求必须提供这样一个序列号。 ANDROID IDANDROID ID是设备第一次启动时产生和存储的64bit的一个数，当设备被wipe后该数重置。 但它也有缺陷：

1. 它在Android <=2.1 or Android >=2.3的版本是可靠、稳定的，但在2.2的版本并不是100%可靠的。
2. 在主流厂商生产的设备上，有一个很经常的bug，就是每个设备都会产生相同的ANDROID_ID：9774d56d682e549c。
3. 厂商定制系统的Bug：有些设备返回的值为null。
4. 设备差异：对于CDMA设备，ANDROID_ID和TelephonyManager.getDeviceId() 返回相同的值。 UUID以上四种方式都有或多或少存在的一定的局限性或者bug，在这里，有另外一种方式解决，就是使用UUID，该方法无需访问设备的资源，也跟设备类型无关。 这种方式是通过在程序安装后第一次运行后生成一个ID实现的，但该方式跟设备唯一标识不一样，它会因为不同的应用程序而产生不同的ID，而不是设备唯一ID。因此经常用来标识在某个应用中的唯一ID（即Installtion ID），或者跟踪应用的安装数量。很幸运的，Google Developer Blog提供了这样的一个框架：

```java
public class Installation {
        private static String sID = null;
        private static final String INSTALLATION = "INSTALLATION";

        public synchronized static String id(Context context) {
            if (sID == null) {
                File installation = new File(context.getFilesDir(), INSTALLATION);
                try {
                    if (!installation.exists())
                        writeInstallationFile(installation);
                    sID = readInstallationFile(installation);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
            return sID;
        }

        private static String readInstallationFile(File installation)
            throws IOException {
            RandomAccessFile f = new RandomAccessFile(installation, "r");
            byte[] bytes = new byte[(int) f.length()];
            f.readFully(bytes);
            f.close();
            return new String(bytes);
        }

        private static void writeInstallationFile(File installation)
            throws IOException {
            FileOutputStream out = new FileOutputStream(installation);
            String id = UUID.randomUUID().toString();
            out.write(id.getBytes());
            out.close();
        }
}
```

综合以上所述，为了实现在设备上更通用的获取设备唯一标识，我们可以实现这样的一个类，为每个设备产生唯一的UUID，以ANDROID_ID为基础，在获取失败时以TelephonyManager.getDeviceId()为备选方法，如果再失败，使用UUID的生成策略。 重申下，以下方法是生成Device ID，在大多数情况下Installtion ID能够满足我们的需求，但是如果确实需要用到Device ID，那可以通过以下方式实现：

```java
public class DeviceUuidFactory {
    protected static final String PREFS_FILE = "device_id.xml";
    protected static final String PREFS_DEVICE_ID = "device_id";
    protected volatile static UUID uuid;

    public DeviceUuidFactory(Context context) {
        if (uuid == null) {
            synchronized (DeviceUuidFactory.class) {
                if (uuid == null) {
                    final SharedPreferences prefs = context.getSharedPreferences(PREFS_FILE, 0);
                    final String id = prefs.getString(PREFS_DEVICE_ID, null);
                    if (id != null) {
                        // Use the ids previously computed and stored in the
                        // prefs file
                        uuid = UUID.fromString(id);
                    } else {
                        final String androidId =
                            Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
                        // Use the Android ID unless it's broken, in which case
                        // fallback on deviceId,
                        // unless it's not available, then fallback on a random
                        // number which we store to a prefs file
                        try {
                            if (!"9774d56d682e549c".equals(androidId)) {
                                uuid = UUID.nameUUIDFromBytes(androidId.getBytes("utf8"));
                            } else {
                                final String deviceId =
                                    ((TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE)).getDeviceId();
                                uuid =
                                    deviceId != null ? UUID.nameUUIDFromBytes(deviceId.getBytes("utf8"))
                                        : UUID.randomUUID();
                            }
                        } catch (UnsupportedEncodingException e) {
                            throw new RuntimeException(e);
                        }
                        // Write the value out to the prefs file
                        prefs.edit().putString(PREFS_DEVICE_ID, uuid.toString()).commit();
                    }
                }
            }
        }
    }

    public UUID getDeviceUuid() {
        return uuid;
    }
}
```

通过这种方式生成的设备标志号在一定程度上可以比较稳定的标记一台Android设备。这个产生标记符的方法有以下几点要注意：

1. 由于现在Android手机已经普遍升级到4.0以上，2.3以下支持有限，所以ANDROID ID一般可用，即以ANDROID ID为种子产生UUID基本可用；
2. 使用Device ID为种子产生UUID并非好的选择，Android平板等不具备通信功能的设备就不能拿到Device ID；
3. 加入有一个需求是希望用户的设备无论在安装多少次应用之后都可以唯一的确定该设备，则可用的方式是什么呢？我们得同时考虑ANDROID ID，Serizal Number以及DEVICE ID，其中任何一个都可以标识设备~~SO，最好的选择是不是将这三个拼接起来作为UUID的种子呢？其中，我们可以排除掉不合法的DEVICE ID等； 检查非法性：

  1. 序列号本身字符是否重复：比如全是000000000;
  2. 是否为Null，用于无法拿到相关数据；
  3. 是否包含*号； 如果这三点中得任意一点满足，则表示该数据非法，可以丢弃使用，否则，可字符拼接作为UUID的种子，如果三种数据都非法，才可以随机生成UUID作为设备标识符。

## 参考资料

<http://www.cnblogs.com/lqminn/p/4204855.html>

<http://android-developers.blogspot.jp/2011/03/identifying-app-installations.html>

<http://stackoverflow.com/questions/2785485/is-there-a-unique-android-device-id>

官方链接：[唯一标识符最佳做法](https://developer.android.google.cn/training/articles/user-data-ids.html)

Android O的变化： [Android O 中对设备标识符所做的变更](http://developers.googleblog.cn/2017/04/android-o.html)