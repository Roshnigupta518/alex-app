package com.alexsocial

import android.os.Bundle // Import statement for Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import expo.modules.ReactActivityDelegateWrapper
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        //super.onCreate(savedInstanceState)
        super.onCreate(null)
        // Show the splash screen
        SplashScreen.show(this)
    }

    override fun getMainComponentName(): String = "Alex Social"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        ReactActivityDelegateWrapper(
            this,
            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
            DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
        )
}
