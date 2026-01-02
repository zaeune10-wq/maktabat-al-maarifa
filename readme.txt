=== Ads.txt & App-ads.txt Manager for WordPress ===
Contributors: the-rock, pagup, freemius
Tags: Adstxt, App-adstxt, Ads.txt, Ads, Advertising
Requires at least: 4.1
Requires PHP: 5.6
Tested up to: 6.8
Stable tag: 1.1.9
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

App-ads.txt & Ads.txt manager allows you to create, manage & publish your app-ads.txt & ads.txt file from your WordPress dashboard. Avoid revenue loss & better Manage your .txt file.

== Description ==

Ad partners are frequently adding new demand sources to their Ads.txt & App-ads.txt lists of authorized sellers.

*	Create your Ads.txt & App-Ads.txt files with the same tool (all-in-one)
*	Add manual entries (copy-paste) for « ready-to-use » code snippets. 
*	Edit & manage your files on demand
*	View Wordpress Ads.txt & App-ads.txt files before/after publishing

**Note :** Google Ad Manager and AdMob, Google’s mobile ad network, now support app-ads.txt, the anti-ad fraud protocol for app publishers. **Why we should care?** Google said in April 2019 that its DSP Display & Video 360 would stop buying unauthorized in-app inventory starting in August 2019 (same with Centro). Given its market leadership position, Google’s support for app-ads.txt from both the buy and sell sides will help propel adoption of the standard by app publishers.

**How does Wordpress Ads.txt & App-ads.txt Manager work** to implement app-ads.txt:

Provide a developer website in your app store listings. Ensure that the proper developer website URL is accessible in the developer website section of the app store (advertising platforms will use this website to verify ads.txt or app-ads.txt files). 
 
In Wordpress Ads.txt & App-ads.txt Manager, go to setting page.

- Ad Source Domain
-- The canonical domain name of the SSP, Exchange, system that bidders connect to (they publishes a document detailing what domain name to use).
- Publisher ID
-- This must contain the same value used in transactions (i.e. OpenRTB bid requests) in the field specified by the SSP/exchange (For OpenRTB = publisher ID | For OpenDirect = publisher’s organization ID).
- Type of Relationship: (Direct, reseller)
-- Your direct demand partners should be listed as “direct.” If your partners are using third-party resellers to sell your inventory, such providers should be listed as “reseller.” In any case, you should not add any provider to your app-ads.txt file unless you or your partner have a direct relationship with them.
- Ad Source ID
-- An ID that uniquely identifies the advertising system within a certification authority. 

Do it for all your authorized digital sellers or resellers of your ad inventory.

Click « Save changes » and Wordpress Ads.txt & App-ads.txt Manager plugin will create a virtual .txt file in the root of your website; for example, www.mysite.com/ads.txt OR www.mysite.com/app-ads.txt. You can edit the content whenever you need.

Make sure to clear your cache

**Note 1 :** Use of app-ads.txt is not mandatory, but is highly recommended, especially if you are concerned that others may be spoofing your app.

**Note 2 :** It can take up to 24 hours to crawl and verify your app-ads.txt files. Please wait at least 24 hours for the app-ads.txt status to update.

**Note 3 :**  Since ads.txt file is supposed to be in the root directory of a domain name, this plugin currently only works for root level domain like example.com. It does not work for WordPress installed in subdomain, subdirectory, or a single site in a multi-site network.

**What’s app-ads.txt?**
In June 2017, the [IAB](https://iabtechlab.com/ads-txt/) (The Interactive Advertising Bureau Tech Lab) launched ads.txt, a file enabling web publishers to designate authorized digital sellers of their ad inventory. Ads.txt helped the industry distinguish real supply sources from fake ones, and after its immediate success and adoption, the next logical step was to extend the reach of ads.txt into the mobile app ecosystem. App-ads.txt is the mobile in-app equivalent of this specification, which mobile publishers can implement.

The app-ads.txt file is the version of ads.txt for mobile in-app and [OTT advertising](https://smartyads.com/blog/what-is-ott-advertising/), to combat bad actors that disguise themselves as another company’s app in order to siphon the money that advertisers are spending on mobile and OTT advertising. App-ads.txt files are formatted the same as ads.txt files ([view IAB FAQ for ads.txt and app-ads.txt](https://iabtechlab.com/wp-content/uploads/2019/03/FAQ-for-ads.txt-and-app-ads.txt-UPDATED-March-4-2019.pdf)).

Thanks to app-ads.txt file, Mobile and OTT app publishers can list the ad tech vendors that are authorized to sell or resell their ad inventory, and programmatic ad buyers can check these lists to make sure that a company claiming to offer an app’s inventory is actually able to sell the app’s inventory. 

This file opens the door for a new level of transparency.

== Frequently Asked Questions ==

= What’s ads.txt ? =
It is an IAB-approved text file that aims to prevent unauthorized inventory sales. In a fragmented advertising ecosystem, ads.txt serves as a method of improving transparency for demand side platforms. In fact, DSPs aren’t buying web supply that isn’t authorized via ads.txt.

Concretly, publishers drop a text file on their web servers that lists all of the companies that are authorized to sell the publishers’ inventory. Similarly, programmatic platforms also integrate ads.txt files to confirm which publishers’ inventory they are authorized to sell. This allows buyers to check the validity of the inventory they purchase.

[More details here](https://youtu.be/T_4uK2HnOy0)

= My .txt file doesn’t show up at all. =
Please clear your browser cache and reload the ads.txt OR app-ads.txt link.

= How does app-ads.txt work for mobile apps? =
A DSP looking to bid on app inventory scans the app-ads.txt file on a developer’s website to verify which ad sources are authorized to sell that app’s inventory. The DSP will only accept bid requests from ad sources listed on the file and authorized by the app developer.

= How app-ads.txt can benefit your mobile app? =
There are two main benefits for app developers.
- Capturing revenue from brand spend. Brands today represent a growing and potentially significant revenue opportunity for developers. We can expect that many DSPs that adhere to app-ads.txt won’t purchase inventory missing the app-ads.txt file, just as they won’t buy unauthorized inventory on web. Developers who don’t implement app-ads.txt are likely to be removed from DSPs’ pool of targeted media.
- Fighting ad fraud. Bad actors may forge apps that impersonate legitimate apps, and mislead DSPs to spend brand budgets on their forged inventory. Legitimate developers end up losing out on ad revenue that was originally intended for them. App-ads.txt blocks unauthorized developer impersonations and minimizes instances of fraud that ultimately hurt developers’ bottom line.

Source : https://www.ironsrc.com/blog/what-is-app-ads-txt/

= How does app-ads.txt help mobile app developers capture more ad revenue? =
**Authorized in-app inventory.** An ever-increasing amount of brands are looking to advertise in-app today. Brand buyers now rely on an adherence to app-ads.txt to make sure they don’t buy unauthorized inventory from app developers and negatively impact campaign performance. Developers who don’t implement app-ads.txt can be removed from any brand buyer’s target media list. That’s why joining the app-ads.txt movement is crucial for publishers to maintain their revenue.

**Ad fraud prevention.** App-ads.txt blocks unauthorized developers who impersonate legitimate apps and mislead DSPs into spending brand budgets on fake inventory. With fraud instances minimized, authentic developers can retain more of the ad revenue from inventory genuinely targeted to their app.

Source : https://support.vungle.com/hc/en-us/articles/360029177591-App-ads-text-Overview

== Installation ==

= Installing manually =

1. Unzip all files to the `/wp-content/plugins/app-ads-txt` directory
2. Log into WordPress admin and activate the 'App-ads.txt & Ads.txt Manager' plugin through the 'Plugins' menu
3. Go to "Settings > App-Ads.txt & Ads.txt" in the left-hand menu to start work on it.

== Screenshots ==

1. App-ads.txt & Ads.txt Manager
2. App-ads.txt & Ads.txt Manager

== Changelog ==

= 1.0.0 =
* Initial release.

= 1.0.1 =
* Fixed Active tab bug.
* Text improvements

= 1.0.2 =
* Fixed a Bug - removed metabox from post types.

= 1.0.3 =
* Text improvements
* Added affiliate program

= 1.0.4 =
* Fixed notification about Permalinks to avoid 404 error for app-ads.txt. Included Screenshot
* Fixed some styling issues

= 1.0.5 =
* Fixed php notices about not defined variable during save and default tab view

= 1.1.0 =
* ads.txt is set for free version (app-ads.txt is available in pro version)
* Fixed php warning inside input value for missing variable during plugin first time activation

= 1.1.1 =
* Fixed some typos

= 1.1.2 =
* Credit text disabled for Pro Version
* Added Russian Translation

= 1.1.3 =
* Fixed a bug adding notification when only custom rules are added

= 1.1.4 =
* Updated freemius to v2.4.1

= 1.1.5 =
* 👌 IMPROVE: Updated freemius to latest v2.4.2
* 👌 IMPROVE: Free version will auto deacitaved upon activation of Pro version
* 👌 IMPROVE: Other minor improvements

= 1.1.6 =
* 🔥 NEW: Meta Tags for SEO promotion

= 1.1.6.1 =
* 🐛 FIX: disabled var_dump on settings page

= 1.1.6.2 =
* 🔥 NEW: Added trranslation for 21 languages

= 1.1.6.3 =
* 👌 IMPROVE: Optin, Notification, WP v5.9 Compatibility

= 1.1.7.0 =
* 🐛 FIX: Security update

= 1.1.7.1 =
* 🐛 FIX: Security fix

= 1.1.8 =
* 🐛 FIX: XSS Security patch
* 👌 IMPROVE: Updated freemius to latest v2.8.1

= 1.1.9 =
* 🐛 FIX: Security fix