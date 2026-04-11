# 🚀 OTTfilter - Google Play Store Publication Guide

## ✅ PRE-LAUNCH CHECKLIST

### 1. Google Play Console Setup
- [ ] Create Google Play Developer Account ($25 one-time fee)
  - Visit: https://play.google.com/console/signup
  - Use your Google account
  - Pay $25 registration fee
  - Complete identity verification

### 2. App Assets Checklist
- [ ] **App Bundle (AAB)** ✅ READY
  - File: `/root/OTTfilter/OTTfilter-PlayStore.aab`
  - Size: 3.4 MB
  - Signed: Yes (with release keystore)

- [ ] **App Icon** ✅ READY
  - Location: `/root/OTTfilter/frontend/public/icon-512.png`
  - Size: 512x512 pixels
  - Format: PNG

- [ ] **Feature Graphic** ⏭️ NEEDS CREATION
  - Size: 1024x500 pixels
  - Use Canva, Figma, or Photoshop
  - See design suggestions in screenshots-info.txt

- [ ] **Screenshots** ⏭️ NEEDS CAPTURE
  - Phone: Minimum 2, Maximum 8
  - Resolution: 1080x1920 or 1920x1080
  - See screenshot-info.txt for ideas

- [ ] **Privacy Policy** ✅ READY
  - Location: `/root/OTTfilter/playstore-assets/privacy-policy.html`
  - Host on: GitHub Pages, Netlify, or your domain
  - URL needed for Play Console

### 3. Store Listing Information
- [ ] **App Name**: OTTfilter - Movie Discovery
- [ ] **Short Description**: AI-powered movie discovery across Netflix, Prime Video, Hotstar, Zee5 & more!
- [ ] **Full Description**: See store-listing.txt
- [ ] **Category**: Entertainment
- [ ] **Tags**: Movies, OTT, Streaming, AI Search

### 4. Content Rating
- [ ] Complete content rating questionnaire in Play Console
- [ ] Expected rating: PEGI 3 / ESRB Everyone

### 5. Pricing & Distribution
- [ ] **App Type**: Free
- [ ] **Countries**: All countries (or select specific)
- [ ] **Contains Ads**: No
- [ ] **In-app Purchases**: No

---

## 📤 UPLOAD STEPS

### Step 1: Create App in Play Console
1. Go to https://play.google.com/console
2. Click "Create App"
3. Enter:
   - App name: OTTfilter
   - Default language: English (US)
   - App or game: App
   - Free or paid: Free
4. Accept Developer Program Policies
5. Click "Create App"

### Step 2: Set Up App
1. **App Access**: Select "All functionality is available without special access"
2. **Ads**: Select "No, my app does not contain ads"
3. **Content Rating**:
   - Click "Start questionnaire"
   - Answer questions honestly
   - For "Reference to drugs/alcohol": No
   - For "Fear": No
   - For "Gambling": No
   - For "Sex and Nudity": No (unless movies show mature content)
   - For "Violence": None or Mild
   - For "Profanity": No
   - For "Crude Humor": No
   - Save and get rating

4. **Target Audience**:
   - Select "13 and over" (due to movie content variety)
   - Answer "No" to designed for children

5. **News Apps**: Select "No"

6. **COVID-19**: Select "No"

7. **Data Safety**:
   - Click "Start survey"
   - Does your app collect data? Select "Yes"
   - Data types collected:
     - [ ] Location - No
     - [ ] Personal Info - No
     - [ ] Financial Info - No
     - [ ] Health & Fitness - No
     - [ ] Messages - No
     - [ ] Photos & Videos - No
     - [ ] Audio Files - No
     - [ ] Files & Docs - No
     - [ ] Calendar - No
     - [ ] Contacts - No
     - [ ] App Activity - Yes (Search queries, app interactions)
     - [ ] Web Browsing - No
     - [ ] App Info & Performance - Yes (Crash logs, diagnostics)
     - [ ] Device ID - No
   - Data usage:
     - App functionality: Yes
     - Analytics: Yes (optional)
     - Developer communications: No
     - Advertising: No
     - Fraud prevention: No
     - Personalization: No
     - Account management: No

### Step 3: Store Listing
Fill in all required fields:

1. **App Details**:
   - App name: OTTfilter - Movie Discovery
   - Short description: (from store-listing.txt)
   - Full description: (from store-listing.txt)

2. **Graphics**:
   - Upload App icon (512x512)
   - Upload Feature graphic (1024x500)
   - Upload Phone screenshots (2-8)
   - Optional: Tablet screenshots

3. **Categorization**:
   - Application type: Applications
   - Category: Entertainment
   - Tags: Movie, Streaming, OTT

4. **Contact Details**:
   - Website: (your website or GitHub repo)
   - Email: (your email)
   - Phone: (optional)

5. **Privacy Policy**:
   - URL: (link to hosted privacy policy)
   - Use: `/root/OTTfilter/playstore-assets/privacy-policy.html`

### Step 4: Create Release
1. Go to "Production" → "Create new release"
2. App signing:
   - Let Google manage signing (recommended) or use your own
   - Upload your AAB
3. Release details:
   - Release name: Version 1.0.0
   - Release notes: 
     ```
     Initial release of OTTfilter!
     
     Features:
     • AI-powered natural language search
     • Discover movies across 10+ OTT platforms
     • Support for Hindi, Tamil, Telugu, Malayalam, Kannada & more
     • Smart filters by genre, rating, year, language
     • Movie details with cast, crew, trailers
     • Content warnings for family-friendly viewing
     ```
4. Save and review

### Step 5: Rollout
1. Review all sections (look for green checkmarks)
2. Click "Start rollout to Production"
3. Confirm rollout
4. Wait for Google review (usually 1-7 days)

---

## 🔐 IMPORTANT: BACKUP YOUR KEYSTORE

**CRITICAL**: Your keystore file is required for all future updates!

```
Location: /root/OTTfilter/frontend/android/app/keystore/ottfilter-keystore.jks
Password: ottfilter123
Alias: ottfilter
```

**BACKUP TO**:
- Cloud storage (Google Drive, Dropbox)
- External drive
- Password manager

**⚠️ If you lose this keystore, you CANNOT update your app on Play Store!**

---

## 📋 REQUIRED FOR APPROVAL

### Technical Requirements
- ✅ Signed AAB uploaded
- ✅ Target SDK 35+ (Android 14+)
- ✅ Min SDK 23+ (Android 6.0+)
- ✅ Privacy policy URL provided

### Content Requirements
- ✅ No copyrighted content without permission
- ✅ No misleading metadata
- ✅ Accurate app description
- ✅ All screenshots from actual app

### Legal Requirements
- ✅ Privacy policy compliant with laws
- ✅ No deceptive practices
- ✅ Proper attribution for movie data

---

## 📱 POST-LAUNCH

### After Approval
1. Monitor crash reports in Play Console
2. Respond to user reviews
3. Track analytics
4. Plan updates based on feedback

### Future Updates
1. Update versionCode in `app/build.gradle`
2. Update versionName
3. Build new AAB: `./gradlew bundleRelease`
4. Upload to Play Console
5. Add release notes

---

## 🆘 TROUBLESHOOTING

### App Rejected?
- Read rejection reason carefully
- Fix the issue
- Resubmit with explanation

### Common Rejection Reasons:
1. **Missing privacy policy** - Add privacy policy URL
2. **Inaccurate description** - Ensure description matches functionality
3. **Copyright issues** - Use only TMDB/JustWatch data properly
4. **Deceptive behavior** - Don't claim features you don't have

### Need Help?
- Google Play Console Help: https://support.google.com/googleplay/android-developer
- Play Console Academy: https://playacademy.withgoogle.com/

---

## 💰 COST SUMMARY

| Item | Cost |
|------|------|
| Google Play Developer Account | $25 (one-time) |
| Hosting Privacy Policy | Free (GitHub Pages) |
| App icon/graphics design | Free (DIY) or Paid (Designer) |
| **Total Minimum Cost** | **$25** |

---

## ✅ FINAL CHECKLIST BEFORE SUBMIT

- [ ] AAB file built and tested
- [ ] Keystore backed up securely
- [ ] Privacy policy hosted online
- [ ] Screenshots captured and polished
- [ ] Feature graphic created
- [ ] Store listing text finalized
- [ ] Content rating completed
- [ ] Data safety form filled
- [ ] All Play Console sections show green checkmarks
- [ ] Ready to publish!

---

**Good luck with your Play Store launch! 🚀**
