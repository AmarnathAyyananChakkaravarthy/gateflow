# GateFlow - Production Release Checklist

Complete pre-launch verification checklist before submitting to app stores.

---

## 📱 App Functionality Testing

### Core Features:
- [ ] QR code scanning works reliably
- [ ] Entry mode logs correctly
- [ ] Exit mode logs correctly
- [ ] Entry/Exit toggle switches properly
- [ ] Student information displays correctly in HUD
- [ ] Success HUD (green) shows for valid students
- [ ] Error HUD (red) shows for invalid QR codes
- [ ] Banned student detection works
- [ ] Duplicate scan prevention (30-second cooldown) works
- [ ] HUD auto-dismisses after 2 seconds
- [ ] Close button (X) dismisses HUD immediately
- [ ] Click outside HUD dismisses it
- [ ] Quick scanner button in logs header works

### Database & Storage:
- [ ] Database initializes correctly on first launch
- [ ] 500 students load successfully (STU-1001 to STU-1500)
- [ ] Access logs save properly
- [ ] Logs persist after app restart
- [ ] 90-day log cleanup works (test with old dates)
- [ ] Database handles multiple rapid scans without errors

### Access Logs Screen:
- [ ] Logs display in correct order (newest first)
- [ ] Filter by date works (Today, This Week, All Time)
- [ ] Student details show correctly in log entries
- [ ] Entry/Exit types display with correct colors
- [ ] Timestamp formatting is correct
- [ ] Empty state shows when no logs exist
- [ ] Navigation back to scanner works

### CSV Export:
- [ ] Export button accessible
- [ ] CSV file generates successfully
- [ ] CSV contains correct data (student ID, name, type, timestamp)
- [ ] Share sheet appears with export options
- [ ] File saves/shares successfully

### Permissions:
- [ ] Camera permission request shows on first launch
- [ ] Permission denial handles gracefully (shows message)
- [ ] Permission granted enables QR scanning
- [ ] App prompts to enable permission if denied

### Performance:
- [ ] App launches in under 3 seconds
- [ ] QR scanning completes in under 2 seconds
- [ ] UI is responsive, no lag
- [ ] No memory leaks after extended use
- [ ] Battery usage is reasonable

### Error Handling:
- [ ] Invalid QR codes show error message
- [ ] Database errors display user-friendly alerts
- [ ] Camera errors handled gracefully
- [ ] Network unavailable doesn't crash app (offline-first)
- [ ] Malformed student IDs handled properly

---

## 🎨 Visual & UX Testing

### Branding:
- [ ] App icon is professional (1024x1024)
- [ ] Splash screen looks good
- [ ] App name "GateFlow" displays correctly
- [ ] Color scheme is consistent (green/orange/red)
- [ ] Typography is readable

### UI/UX:
- [ ] All text is readable at default font size
- [ ] Buttons have appropriate hit areas
- [ ] Touch targets are at least 44x44 points
- [ ] Scrolling is smooth
- [ ] Animations are smooth (HUD appearance/dismissal)
- [ ] No UI elements cut off on different screen sizes
- [ ] Dark theme looks professional

### Accessibility:
- [ ] Text contrast meets WCAG AA standards
- [ ] Buttons have descriptive labels
- [ ] Error messages are clear
- [ ] Important actions are easy to discover

---

## 📄 Documentation & Legal

### Privacy Policy:
- [ ] Privacy policy written
- [ ] Privacy policy hosted on public URL
- [ ] URL accessible and loads correctly
- [ ] Policy covers all data collection (student IDs, logs)
- [ ] Policy explains local storage vs cloud
- [ ] Policy describes data retention (90 days)
- [ ] Contact information included

### App Store Assets:
- [ ] App icon (1024x1024 PNG) created
- [ ] Feature graphic (1024x500 PNG for Play Store) created
- [ ] Adaptive icon (1024x1024 for Android) created
- [ ] Splash screen (1284x2778) created
- [ ] All assets are high quality, no placeholders

### Screenshots:
- [ ] Scanner screen screenshot captured
- [ ] Success HUD screenshot captured
- [ ] Access Logs screenshot captured
- [ ] CSV export screenshot captured (optional)
- [ ] Error state screenshot captured (optional)
- [ ] Screenshots are clear and professional
- [ ] Screenshots show actual app content (not mockups)
- [ ] All required device sizes covered

### Descriptions:
- [ ] App name decided and available
- [ ] Short description written (80 chars for Play Store)
- [ ] Subtitle written (30 chars for App Store)
- [ ] Full description written (under 4000 chars)
- [ ] Keywords identified (100 chars for App Store)
- [ ] Description accurately represents app features
- [ ] No marketing fluff or false claims
- [ ] Grammar and spelling checked

### Support Materials:
- [ ] Support email set up and monitored
- [ ] Support URL (optional) created
- [ ] FAQ prepared (optional)
- [ ] Demo QR codes prepared for reviewers

---

## 🔧 Technical Configuration

### app.json:
- [ ] App name correct: "GateFlow"
- [ ] Bundle ID Android: "com.gateflow.app"
- [ ] Bundle ID iOS: "com.gateflow.app"
- [ ] Version: "1.0.0"
- [ ] Android versionCode: 1
- [ ] iOS buildNumber: "1"
- [ ] Permissions declared correctly
- [ ] Camera usage description clear
- [ ] All asset paths correct

### eas.json:
- [ ] Production profile uses "app-bundle" for Android
- [ ] iOS production profile configured
- [ ] Submit configuration prepared (optional)

### package.json:
- [ ] All dependencies up to date
- [ ] No unused dependencies
- [ ] Version matches app.json

### Code Quality:
- [ ] TypeScript compilation passes: `npx tsc --noEmit`
- [ ] No console errors in production
- [ ] No debug logs left in production code
- [ ] All TODO comments resolved or documented
- [ ] Code follows best practices

---

## 🏗️ Build Configuration

### Android (Play Store):
- [ ] AAB build profile configured
- [ ] Android keystore generated (EAS handles this)
- [ ] Package name matches Play Store listing
- [ ] Version code incremented properly
- [ ] Minimum SDK version appropriate (21+)
- [ ] Target SDK version latest (34)
- [ ] ProGuard/R8 enabled for release (default with EAS)

### iOS (App Store):
- [ ] Bundle identifier matches App Store Connect
- [ ] Provisioning profiles configured (EAS handles this)
- [ ] Certificates valid (EAS handles this)
- [ ] Build number incremented properly
- [ ] Minimum iOS version appropriate (13.0+)
- [ ] Export compliance determined

---

## 🧪 Device Testing

### Android Testing:
- [ ] Tested on physical Android device
- [ ] Tested on Android 8.0 (minimum)
- [ ] Tested on Android 14 (latest)
- [ ] Tested on small screen (5.5")
- [ ] Tested on large screen (6.5"+)
- [ ] Tested on tablet (optional)
- [ ] QR scanning works on all devices
- [ ] Performance acceptable on lower-end devices

### iOS Testing:
- [ ] Tested on physical iPhone (via TestFlight)
- [ ] Tested on iPhone SE (small screen)
- [ ] Tested on iPhone 14 Pro Max (large screen)
- [ ] Tested on iPad (optional but recommended)
- [ ] iOS 13 compatibility verified
- [ ] iOS 17 (latest) compatibility verified

### Edge Cases:
- [ ] Tested with poor lighting (QR scanning)
- [ ] Tested with damaged QR codes
- [ ] Tested with rapid successive scans
- [ ] Tested with database containing 10,000+ logs
- [ ] Tested app after being in background for hours
- [ ] Tested after device restart
- [ ] Tested with low battery mode
- [ ] Tested with airplane mode (offline)

---

## 🔐 Security & Compliance

### Data Security:
- [ ] No API keys hardcoded
- [ ] No sensitive data in logs
- [ ] Local database secured
- [ ] No data transmitted over network
- [ ] SQL injection prevented (parameterized queries ✅)
- [ ] User data can be deleted (uninstall app)

### Permissions:
- [ ] Only necessary permissions requested
- [ ] Permission rationale clear to users
- [ ] App functions gracefully if permission denied
- [ ] No unnecessary background permissions

### Compliance:
- [ ] GDPR compliant (if operating in EU)
- [ ] CCPA compliant (if operating in California)
- [ ] COPPA compliant (not targeting children under 13)
- [ ] Local laws regarding student data considered

---

## 📱 Store-Specific Requirements

### Google Play Store:
- [ ] Google Play Developer account created ($25)
- [ ] Play Console access configured
- [ ] Content rating questionnaire completed
- [ ] Data safety form completed accurately
- [ ] Target audience set (18+)
- [ ] App category selected (Business/Education)
- [ ] AAB file built and downloaded
- [ ] Store listing 100% complete
- [ ] All warnings resolved in Play Console

### Apple App Store:
- [ ] Apple Developer account active ($99/year)
- [ ] App Store Connect access configured
- [ ] App created in App Store Connect
- [ ] Bundle ID registered
- [ ] App Store Connect API key configured in EAS
- [ ] App privacy questionnaire completed
- [ ] Age rating completed (4+ or 9+)
- [ ] Export compliance declared
- [ ] App review information provided
- [ ] Demo instructions written for reviewers
- [ ] IPA file built
- [ ] All metadata sections complete

---

## 🎯 Pre-Submission Final Checks

### 24 Hours Before Submission:
- [ ] Create fresh app install
- [ ] Test complete user flow start to finish
- [ ] Verify no crashes or major bugs
- [ ] Check all features work as described
- [ ] Review app store descriptions one more time
- [ ] Verify screenshots are correct and current
- [ ] Test on multiple devices
- [ ] Ask colleague/friend to test (fresh eyes)

### Immediately Before Submission:
- [ ] Latest build uploaded
- [ ] Build processed successfully (no errors)
- [ ] Version numbers correct everywhere
- [ ] Release notes written
- [ ] Demo materials prepared for reviewers
- [ ] Support email actively monitored
- [ ] Backup contact person identified
- [ ] Reviewed all store listing content one final time

### Post-Submission:
- [ ] Submission confirmation received
- [ ] Email notifications enabled
- [ ] Calendar reminder set to check status daily
- [ ] Response plan for rejection ready
- [ ] Marketing materials prepared for launch
- [ ] Social media posts drafted
- [ ] Stakeholder notification list ready

---

## 🚀 Launch Day Preparation

### When Status Changes to "Pending Developer Release":
- [ ] Review final app store page
- [ ] Verify all content displays correctly
- [ ] Check release timing (release immediately vs scheduled)
- [ ] Prepare announcement

### Immediately After Release:
- [ ] Verify app appears in store search
- [ ] Test download and installation
- [ ] Check app page displays correctly
- [ ] Share App Store/Play Store links
- [ ] Send notifications to stakeholders
- [ ] Post on social media
- [ ] Update website/documentation
- [ ] Monitor initial reviews closely

### First Week After Launch:
- [ ] Monitor crash reports daily
- [ ] Respond to user reviews within 24 hours
- [ ] Track download numbers
- [ ] Collect user feedback
- [ ] Note common complaints/requests
- [ ] Plan first update based on feedback

---

## ⚠️ Red Flags - Don't Submit If:

**Critical Issues:**
- [ ] App crashes on launch
- [ ] QR scanning doesn't work
- [ ] Database fails to initialize
- [ ] Major features broken
- [ ] Privacy policy URL broken
- [ ] Screenshots show placeholder content
- [ ] App name/bundle ID mismatch
- [ ] Required permissions not requested
- [ ] Description contains false claims

**Fix before submitting:**
- [ ] TypeScript errors exist
- [ ] Console shows critical errors
- [ ] Performance is unacceptably slow
- [ ] UI has major visual bugs
- [ ] Test data visible in production
- [ ] Debug code still present
- [ ] Assets are low quality or missing

---

## 📊 Success Metrics to Track

### Week 1:
- Downloads
- Crash rate
- User ratings
- Review sentiment
- Support requests

### Month 1:
- Active users
- Session length
- Feature usage (scans per day)
- Retention rate
- Update adoption

---

## 🆘 Common Pre-Launch Issues

### "Build fails to upload"
**Check:**
- Version code incremented
- Bundle ID matches store
- Certificates valid

### "Screenshots rejected"
**Check:**
- Correct dimensions
- Actual app content (not mockups)
- No placeholder text
- Professional quality

### "Privacy policy inadequate"
**Fix:**
- Add more detail about data collection
- Explain retention policy clearly
- Include contact information
- Host on permanent URL

### "App metadata incomplete"
**Fix:**
- Review all sections in store console
- Look for yellow/red warnings
- Complete all required fields
- Save and re-check

---

## ✅ Final Sign-Off

Before clicking "Submit for Review":

**I confirm that:**
- [ ] I have tested the app thoroughly on real devices
- [ ] All features work as described in the store listing
- [ ] Privacy policy is accurate and accessible
- [ ] Screenshots and descriptions are truthful
- [ ] I am ready to support users and respond to reviews
- [ ] I understand the review process may take 1-7 days
- [ ] I have a plan for addressing rejection if it occurs
- [ ] I will monitor emails daily during review process

**Submitted by:** ________________
**Date:** ________________
**Build version:** ________________

---

## 📚 Additional Resources

- **Google Play Console:** https://play.google.com/console
- **Apple App Store Connect:** https://appstoreconnect.apple.com/
- **EAS Documentation:** https://docs.expo.dev/eas/
- **Play Store Policies:** https://play.google.com/about/developer-content-policy/
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/

---

**You're ready to launch! 🎉**

Good luck with your submission! Remember:
- Take your time
- Test thoroughly
- Be honest in descriptions
- Provide excellent support
- Iterate based on feedback

**Next step:** Follow [PLAY_STORE_RELEASE.md](./PLAY_STORE_RELEASE.md) and [APP_STORE_RELEASE.md](./APP_STORE_RELEASE.md) for detailed submission instructions.
