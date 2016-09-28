# AdWordsReport
Wrapper for the AdWordsApp.report class

This a  wrapper for the [AdWordsApp.report()](https://developers.google.com/adwords/scripts/docs/reference/adwordsapp/adwordsapp_report) no more annoying strings when you expect floats or arrays and more neat way to write your AWQL-string.

## Updates
For public Release Notes on the AdWords API see: https://developers.google.com/adwords/api/docs/reference/
#### API v201607

|Report|Column|Info|
|---|---|---|
|Various reports|ConvertedClicks|The **ConvertedClicks** field and its derived fields are removed from all reports. See the [release notes](https://developers.google.com/adwords/api/docs/reference/#new-report-v201607) for more information about what to use instead. In addition, the **CreativeConversions** and **CreativeConversionRate** fields were added to the CREATIVE\_CONVERSION_REPORT.
|Final Url report, Search Query Performance report|EffectiveFinalUrl, FinalURL|The **[EffectiveFinalUrl](https://developers.google.com/adwords/api/docs/appendix/reports/final-url-report#effectivefinalurl)** field in the Final Url report and the **[FinalUrl](https://developers.google.com/adwords/api/docs/appendix/reports/search-query-performance-report#finalurl)** field in the Search Query Performance report will now return a default value of "--" instead of a blank value when no final URL is specified.|
|Various reports|ClickType|The **[ClickType](https://developers.google.com/adwords/api/docs/appendix/reports/all-reports#clicktype)** field can now return two additional types of clicks: **VIDEO_END_CAP_CLICKS** (display value "End cap") and **APP_DEEPLINK** (display value "App engagement ad deep link").|
|Various reports|QualityScore|The **[QualityScore](https://developers.google.com/adwords/api/docs/appendix/reports/all-reports#qualityscore)** field will now return a value of "--" and the **[HasQualityScore](https://developers.google.com/adwords/api/docs/appendix/reports/all-reports#hasqualityscore)** field will return a value of false when no quality score is available.|

## Installation

Just [copy and paste](https://raw.githubusercontent.com/getscript/AdWordsReport/master/dist/AdWordsReport.min.js) into the bottom of your adwords script.

## Examples

```javascript
function main() {
  var adWordsReport = new AdWordsReport();
  var report = adWordsReport.awql()
    .select(['Clicks','Impressions','Year','Cost','SearchImpressionShare','Labels','CampaignName'])
    .from('CAMPAIGN_PERFORMANCE_REPORT')
    .where('Clicks > 0')
    .and('Impressions > 10')
    .and('Cost > 1')
    .during('20120101,20151231')
    .run();
  Logger.log(report);
}
```

```
{  
 "data":[  
    {  
      "Impressions":16559.0,
      "Year":"2012",
      "CampaignName":"Example Campaign",
      "Labels":null,
      "SearchImpressionShare":0.0,
      "Clicks":316.0,
      "Cost":582.33
    },
    {  
      "Impressions":906.0,
      "Year":"2012",
      "CampaignName":"Another Campaign Example",
      "Labels":null,
      "SearchImpressionShare":0.9902,
      "Clicks":25.0,
      "Cost":110.14
    },
    {  
      "Impressions":61.0,
      "Year":"2015",
      "CampaignName":". | AdWords Scripts | Research",
      "Labels":[  
        ".",
        "adwords scripts",
        "research",
        "blogg",
        "kaugesaar",
        "test",
        "test-t"
      ],
      "SearchImpressionShare":0.391,
      "Clicks":1.0,
      "Cost":4.81
    }
  ],
  rows: function() {...},
}
```

You can also utilize the exportToSheet.

```javascript
function main() {
    var adWordsReport = new AdWordsReport();
        adWordsReport.use({exportToSheet:true});
    var report = adWordsReport.awql()
        .select(['Clicks','Impressions','Year','Cost','SearchImpressionShare','Labels','CampaignName'])
        .from('CAMPAIGN_PERFORMANCE_REPORT')
        .where('Clicks > 0')
        .and('Impressions > 10')
        .and('Cost > 1')
        .during('20120101,20151231')
        .run();
    Logger.log(report);
}
```

A spreadsheet will be created on your google drive and in your object you'll have all the necessary information such as id, name and url.

```
{  
  "data":[  
     {  
       "Impressions":16559.0,
       "Year":"2012",
       "CampaignName":"Example Campaign",
       "Labels":null,
       "SearchImpressionShare":0.0,
       "Clicks":316.0,
       "Cost":582.33
     },
     {  
       "Impressions":906.0,
       "Year":"2012",
       "CampaignName":"Another Campaign Example",
       "Labels":null,
       "SearchImpressionShare":0.9902,
       "Clicks":25.0,
       "Cost":110.14
     },
     {  
       "Impressions":61.0,
       "Year":"2015",
       "CampaignName":". | AdWords Scripts | Research",
       "Labels":[  
         ".",
         "adwords scripts",
         "research",
         "blogg",
         "kaugesaar",
         "test",
         "test-t"
       ],
       "SearchImpressionShare":0.391,
       "Clicks":1.0,
       "Cost":4.81
     }
   ],
   rows: function() {...},
   "sheetName":"AdWordsReport - November 17, 2015",
   "sheetId":"1rfuQRUQn03aLkTKPoI9swoCq6r9RNDYFgH7CegMtSMU",
   "sheetUrl":"https://docs.google.com/spreadsheets/d/1rfuQRUQn03aLkTKPoI9swoCq6r9RNDYFgH7CegMtSMU/edit"
}
```

It has functionality for rows() -> hasNext() similar to AdWordsApp.report.

```javascript
function main() {  
  var adWordsReport = new AdWordsReport();
  var report = adWordsReport.awql()
    .select(['Ctr','SearchImpressionShare','Cost','Impressions','AccountDescriptiveName'])
    .from('CAMPAIGN_PERFORMANCE_REPORT')
    .where('SearchImpressionShare > 0.1')
    .during('20150101,20151231')
    .run();
  var rows = report.rows();
  while(rows.hasNext()) {
    var row = rows.next();
    Logger.log(row.AccountDescriptiveName);
    Logger.log(row.SearchImpressionShare);
    Logger.log(row.Cost / row.Impressions);
  }
}
```
