---
title: FireBse-Bugfix 记录
date: 2017-06-19
categories: Android
tags:
   - Android
   - Java
   - 优化
---

对FireBase上出现的问题做一下记录。

<!-- more -->

## 空指针错误

### 对底层返回结果判空

```java
if (!BitmapUtils.isAvailableBitmap(mMakeupBitmap) || mIsdarkOpen) {
    mMakeupBitmap = MtImageControl.instance().getShowImage(MtImageControl.TYPE_IMAGE_RESULT);
} else {
    MtImageControl.instance().getShowImageFill(mMakeupBitmap, MtImageControl.TYPE_IMAGE_RESULT,
        MtImageControl.DEFAULT_FILTER_ALPHA);
}
```

mMakeupBitmap可能为空

### 对底层操作返回判断

```java
processSkinBeauty(mRealNativeBitmap, getFaceData(), getInterPoint(), mBeautyProcessorValue);
```

要对processSkinBeauty返回结果判断，不能直接返回true，后面操作容易出现问题

### 异步回调

异步回调里可能activity已经销毁，这时候做一些UI操作可能引起空指针，(也不一定是空指针，也可能返回一下其他错误，状态错误等)

### onAttach使用错误(崩溃率高)

Android SDK 23以下可能在使用onAttach(Context context)方法时，获取到的context为null

需要： 同时判断onAttach(Context context)和onAttach(Activitycontext)使用有调用的方法

```java
@Override
public void onAttach(Context context) {
    super.onAttach(context);
    onAttachToContext(context);
}

@SuppressWarnings("deprecation")
@Override
public void onAttach(Activity activity) {
    super.onAttach(activity);
    onAttachToContext(activity);
}

/**
 * Bugfix:Android SDK 23以下可能在使用onAttach(Context context)方法时，获取到的context为null
 * @param context 上下文
 */
private void onAttachToContext(Context context) {
    if (mActivity == null && context != null && context instanceof Activity) {
        mActivity = (Activity) context;
        try {
            mFineTuneListener = (MakeUpFineTuneListener) context;
        } catch (ClassCastException e) {
            e.printStackTrace();
        }
    }
}
```

### 链式调用

```
localUri.getScheme().equals("file")
```

localUri.getScheme()可能为空 解决方法：

- 1、判空
- 2、与常量比较可以倒过来
- 3、空对象设计模式

### 多线程同时操作一个对象

```java
if (!isForce && !needPush) {
    mPushConfig = null;
    return;
}

ThreadUtil.runOnThread(new Runnable() {
    @Override
    public void run() {
        Request request = new Request.Builder().url(mPushConfig.pushUrl).build();
        Response response = null;
        try {
            OkHttpClient client = new OkHttpClient();
            response = client.newCall(request).execute();
            if (response.isSuccessful()) {
                //TO DO
            } else {
                onError();
            }
        } catch (IOException e) {
            e.printStackTrace();
            onError();
        }
    }
});
```

```java
final String url = mPushConfig.pushUrl;
Request request = new Request.Builder().url(url).build();
OkHttpClient client = new OkHttpClient();
client.newCall(request).enqueue(new Callback() {
    @Override
    public void onFailure(Call call, IOException e) {
        onError();
    }

    @Override
    public void onResponse(Call call, Response response)
        throws IOException {
        if (response.isSuccessful()) {
            //TO DO
        } else {
            onError();
        }
    }
});
```

- 1、多线程操作一个对象需要注意
- 2、OkHttp本身有封装多线程方法

常见情况：线程里操作对象，在主线程或者其他线程里面清除了数据

### bitmap销毁

直接调用bitmap.recycle bitmap可能为空指针

解决办法：

```java
BitmapUtils.release(bitmap)
```

### fragment getString

异步回调里易发生detach后调用导致空指针

### 在不同回调了调用了初始化，导致未初始化完成点击事件的触发空指针

增高模块

### Dialog在activity销毁后调用show

<http://stackoverflow.com/questions/18662239/android-view-windowmanagerbadtokenexception-unable-to-add-window-on-buider-s>

### 线程操作后调用mActivity.runOnUIThread
```java
ThreadUtil.runOnThread(new Runnable() {
                @Override
                public void run() {
                    mCropProcessor.cropBitmap(mEcvCropView.getCropSelectedRectFRatio());

                    if (mActivity != null && isAdded()) {
                        mActivity.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                dismissProgressDialog();
                                CropFragment.super.onClickApply();
                            }
                        });
                    }

                }
            });
```

### 字符串错误

分机型的Build.Model包含不能作为header的字符，需去除这些字符

解决办法： 需去除这些字符，若去除后长度为0，则标记为UNKOWN
