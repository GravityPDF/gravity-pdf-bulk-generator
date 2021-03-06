=== Gravity PDF Bulk Generator ===

== Frequently Asked Questions ==

= How do I receive support? =

User's with a valid, active license key can receive support for this plugin by filling out the form at [GravityPDF.com](https://gravitypdf.com/support/).

== Changelog ==

= Version 1.1.2, 22 October 2020 =
* Bug: Close all active buffers before streaming zip download to client
* Bug: Fix entry filtering with the less than (>) or greater than (<) operators
* Bug: Scope the CSS so it only applies to the Bulk Generator UI

= Version 1.1.1, 4 June 2020 =
* Bug: ensure plugin functions as expected when Gravity Forms No Conflict mode is enabled
* Security: return empty value when {created_by:user_pass} mergetag is used
* Security: run {date_created}, {date_updated}, and {payment_date} mergetag through GFCommon::format_variable_value() which handles URL encoding and HTML escaping (if required)

= Version 1.1.0, 26 May 2020 =
* Housekeeping: Add performance improvements to log messages when handling 1000s PDFs
* Housekeeping: Add code splitting and reduce JavaScript bundle size
* Bug: ensure all API requests get cancelled when modal window closed

= Version 1.0.2, 28 April 2020 =

* Bug: Resolve duplicate Common Tag getting added to Directory Structure
* Bug: Fix incorrect Directory Structure when not using Common Tags
* Bug: Fix issue using other Bulk Action options besides 'Download PDF'

= Version 1.0.1, 23 April 2020 =

* Fix Update Nag

= Version 1.0.0, 22 April 2020 =

* Initial Release
