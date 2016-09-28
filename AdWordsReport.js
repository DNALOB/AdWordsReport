/**
 * @license MIT
 * @author Victor Kaugesaar <kaugesaar@gmail.com>
 * AdWordsReport.js (http://github.com/getscript/AdWordsReport)
 * Built for AdWords API v201607
 * Licensed under the MIT license
 */

/* exported AdWordsReport, */
/* globals AdWordsApp, Logger, SpreadsheetApp */

/**
 * AdWordsReport
 * Wrapper for AdWordsApp.report() (Google AdWords Scripts)
 *
 * @param  {object} settings
 * @return {object}
 */
var AdWordsReport = function(settings) {
  'use strict';
  settings = settings || {};
  settings.exportToSheet = settings.exportToSheet || false;
  settings.zeroImpression = settings.zeroImpression || true;
  settings.lowImpressionShare = settings.lowImpressionShare || 0.01;
  settings.awqlOptions = {};

  var _tempData = [];

  /**
   * Transform a string in to Date
   * @param {string} value
   * @return {Date}
   */
  var _date = function(value) {
    // @TODO:
    // We are still working on this
    // For so long just return a string
    return _string(value);
  }

  /**
   * Transform a string in to an object
   * @param  {string} value
   * @return {object}
   */
  var _json = function(value) {
    if(value === '--') {
      return [];
    }
    if(typeof JSON.parse(value) === 'object') {
      return JSON.parse(value);
    }
    return [value]
  };

  /**
   * Assure that we do return a string
   * @param  {string} value
   * @return {string}
   */
  var _string = function(value) {
    return String(value);
  };

  /**
   * Transform a string into a number
   * @param  {string} value
   * @return {number}
   */
  var _number = function(value) {
    value = String(value);
    if(value.indexOf('<') > -1) {
      return settings.lowImpressionShare;
    }
    if(value.indexOf('%') > -1) {
      return (Number(value.replace(/[%]/g,'')) / 100);
    }
    if(value === '--') {
      return Number(0);
    }
    return Number(value.replace(/,/g,''));
  };

  /**
   * All columns used in the adwords report api
   * some new ones might be missing, feel free to
   * raise an issue or contribute with a pull request.
   * @type {object}
   */
  var _columns = {
    AccountCurrencyCode: _string,
    AccountDescriptiveName: _string,
    AccountTimeZoneId: _string,
    ActiveViewCpm: _number,
    ActiveViewCtr: _number,
    ActiveViewImpressions: _number,
    ActiveViewMeasurability: _number,
    ActiveViewMeasurableCost: _number,
    ActiveViewMeasurableImpressions: _number,
    ActiveViewViewability: _number,
    AdFormat: _string,
    AdGroupAdDisapprovalReasons: _json,
    AdGroupAdTrademarkDisapproved: _boolean,
    AdGroupCount: _number,
    AdGroupCreativesCount: _number,
    AdGroupCriteriaCount: _number,
    AdGroupCriterionStatus: _string,
    AdGroupDesktopBidModifier: _number,
    AdGroupId: _number,
    AdGroupMobileBidModifier: _number,
    AdGroupName: _string,
    AdGroupsCount: _number,
    AdGroupStatus: _string,
    AdGroupTabletBidModifier: _number,
    AdId: _number,
    AdNetworkType1: _string,
    AdNetworkType2: _string,
    AdType: _string,
    AdvertiserExperimentSegmentationBin: _string,
    AdvertisingChannelSubType: _string,
    AdvertisingChannelType: _string,
    AggregatorId: _number,
    AllConversionRate: _number,
    AllConversions: _number,
    AllConversionValue: _number,
    Amount: _number,
    AoiMostSpecificTargetId: _number,
    ApprovalStatus: _string,
    AssociatedCampaignId: _number,
    AssociatedCampaignName: _string,
    AssociatedCampaignStatus: _string,
    AttributeValues: _json,
    AverageCost: _number,
    AverageCpc: _number,
    AverageCpe: _number,
    AverageCpm: _number,
    AverageCpv: _number,
    AverageFrequency: _number,
    AveragePageviews: _number,
    AveragePosition: _number,
    AverageTimeOnSite: _number,
    BaseAdGroupId: _number,
    BaseCampaignId: _number,
    BenchmarkAverageMaxCpc: _number,
    BenchmarkCtr: _number,
    BiddingStrategyId: _number,
    BiddingStrategyName: _string,
    BiddingStrategySource: _string,
    BiddingStrategyType: _string,
    BidModifier: _number,
    BidType: _string,
    BounceRate: _number,
    Brand: _string,
    BudgetCampaignAssociationStatus: _string,
    BudgetId: _number,
    BudgetName: _string,
    BudgetReferenceCount: _number,
    BudgetStatus: _string,
    BusinessName: _string,
    CallDuration: _number,
    CallEndTime: _number,
    CallerCountryCallingCode: _string,
    CallerNationalDesignatedCode: _string,
    CallOnlyPhoneNumber: _string,
    CallStartTime: _number,
    CallStatus: _string,
    CallTrackingDisplayLocation: _string,
    CallType: _string,
    CampaignCount: _number,
    CampaignDesktopBidModifier: _number,
    CampaignId: _number,
    CampaignLocationTargetId: _number,
    CampaignMobileBidModifier: _number,
    CampaignName: _string,
    CampaignsCount: _number,
    CampaignStatus: _string,
    CampaignTabletBidModifier: _number,
    CampaignTrialType: _string,
    CanManageClients: _boolean,
    Category0: _string,
    Category1: _string,
    Category2: _string,
    CategoryL1: _string,
    CategoryL2: _string,
    CategoryL3: _string,
    CategoryL4: _string,
    CategoryL5: _string,
    CategoryPaths: _string,
    Channel: _string,
    ChannelExclusivity: _string,
    CityCriteriaId: _number,
    ClickAssistedConversions: _number,
    ClickAssistedConversionsOverLastClickConversions: _number,
    ClickAssistedConversionValue: _number,
    Clicks: _number,
    ClickSignificance: _number,
    ClickType: _string,
    CombinedAdsOrganicClicks: _number,
    CombinedAdsOrganicClicksPerQuery: _number,
    CombinedAdsOrganicQueries: _number,
    ContentBidCriterionTypeGroup: _string,
    ContentBudgetLostImpressionShare: _number,
    ContentImpressionShare: _number,
    ContentRankLostImpressionShare: _number,
    ConversionCategoryName: _string,
    ConversionRate: _number,
    Conversions: _number,
    ConversionTrackerId: _number,
    ConversionTypeName: _string,
    ConversionValue: _number,
    Cost: _number,
    CostPerAllConversion: _number,
    CostPerConversion: _number,
    CostSignificance: _number,
    CountryCriteriaId: _number,
    CpcBid: _number,
    CpcBidSource: _string,
    CpcSignificance: _number,
    CpmBid: _number,
    CpmBidSource: _string,
    CpmSignificance: _number,
    CpvBid: _number,
    CpvBidSource: _string,
    CreativeApprovalStatus: _string,
    CreativeConversionRate: _number,
    CreativeConversions: _number,
    CreativeDestinationUrl: _string,
    CreativeFinalAppUrls: _json,
    CreativeFinalMobileUrls: _json,
    CreativeFinalUrls: _json,
    CreativeId: _number,
    CreativeQualityScore: _string,
    CreativeStatus: _string,
    CreativeTrackingUrlTemplate: _string,
    CreativeUrlCustomParameters: _json,
    Criteria: _string,
    CriteriaDestinationUrl: _string,
    CriteriaId: _number,
    CriteriaParameters: _string,
    CriteriaStatus: _string,
    CriteriaType: _string,
    CriteriaTypeName: _string,
    CriterionId: _number,
    CriterionType: _string,
    CrossDeviceConversions: _number,
    Ctr: _number,
    CtrSignificance: _number,
    CustomAttribute0: _string,
    CustomAttribute1: _string,
    CustomAttribute2: _string,
    CustomAttribute3: _string,
    CustomAttribute4: _string,
    CustomerDescriptiveName: _string,
    Date: _date,
    DayOfWeek: _string,
    DeliveryMethod: _string,
    Description: _string,
    Description1: _string,
    Description2: _string,
    DestinationUrl: _string,
    Device: _string,
    DevicePreference: _number,
    DisapprovalShortNames: _json,
    DisplayName: _string,
    DisplayUrl: _string,
    DistanceBucket: _string,
    Domain: _string,
    EffectiveDestinationUrl: _string,
    EffectiveFinalUrl: _string,
    EffectiveTrackingUrlTemplate: _string,
    EndDate: _date,
    EndTime: _date,
    EngagementRate: _number,
    Engagements: _number,
    EnhancedCpcEnabled: _boolean,
    EnhancedCpvEnabled: _boolean,
    EstimatedAddClicksAtFirstPositionCpc: _number,
    EstimatedAddCostAtFirstPositionCpc: _number,
    ExtensionPlaceholderCreativeId: _number,
    ExtensionPlaceholderType: _number,
    ExternalCustomerId: _number,
    FeedId: _number,
    FeedItemAttributes: _json,
    FeedItemEndTime: _number,
    FeedItemId: _number,
    FeedItemStartTime: _number,
    FeedItemStatus: _string,
    FinalAppUrls: _json,
    FinalMobileUrls: _json,
    FinalUrl: _string,
    FinalUrls: _json,
    FirstPageCpc: _number,
    FirstPositionCpc: _number,
    GclId: _string,
    GeoTargetingCriterionId: _number,
    GeoTargetingRestriction: _string,
    GmailForwards: _number,
    GmailSaves: _number,
    GmailSecondaryClicks: _number,
    HasQualityScore: _boolean,
    Headline: _string,
    HeadlinePart1: _string,
    HeadlinePart2: _string,
    HourOfDay: _number,
    Id: _number,
    ImageAdUrl: _string,
    ImageCreativeImageHeight: _number,
    ImageCreativeImageWidth: _number,
    ImageCreativeName: _string,
    ImpressionAssistedConversions: _number,
    ImpressionAssistedConversionsOverLastClickConversions: _number,
    ImpressionAssistedConversionValue: _number,
    ImpressionReach: _number,
    Impressions: _number,
    ImpressionSignificance: _number,
    InteractionRate: _number,
    Interactions: _number,
    InteractionTypes: _string,
    InvalidClickRate: _number,
    InvalidClicks: _number,
    IsAutoOptimized: _boolean,
    IsAutoTaggingEnabled: _boolean,
    IsBidOnPath: _boolean,
    IsBudgetExplicitlyShared: _boolean,
    IsNegative: _boolean,
    IsPathExcluded: _boolean,
    IsRestrict: _boolean,
    IsSelfAction: _boolean,
    IsTargetingLocation: _boolean,
    IsTestAccount: _boolean,
    KeywordId: _number,
    KeywordMatchType: _string,
    KeywordTargetingId: _number,
    KeywordTargetingMatchType: _string,
    KeywordTargetingText: _string,
    KeywordTextMatchingQuery: _string,
    LabelId: _number,
    LabelIds: _json,
    LabelName: _string,
    Labels: _json,
    LanguageCriteriaId: _number,
    Line1: _string,
    LocationType: _string,
    LongHeadline: _string,
    LopMostSpecificTargetId: _number,
    MemberCount: _number,
    MerchantId: _number,
    MetroCriteriaId: _number,
    Month: _string,
    MonthOfYear: _string,
    MostSpecificCriteriaId: _number,
    Name: _string,
    NonRemovedAdGroupCount: _number,
    NonRemovedAdGroupCriteriaCount: _number,
    NonRemovedCampaignCount: _number,
    NumOfflineImpressions: _number,
    NumOfflineInteractions: _number,
    OfferId: _string,
    OfflineInteractionRate: _number,
    OrganicAveragePosition: _number,
    OrganicClicks: _number,
    OrganicClicksPerQuery: _number,
    OrganicImpressions: _number,
    OrganicImpressionsPerQuery: _number,
    OrganicQueries: _number,
    Page: _number,
    PageOnePromotedBidCeiling: _number,
    PageOnePromotedBidChangesForRaisesOnly: _boolean,
    PageOnePromotedBidModifier: _number,
    PageOnePromotedRaiseBidWhenBudgetConstrained: _boolean,
    PageOnePromotedRaiseBidWhenLowQualityScore: _boolean,
    PageOnePromotedStrategyGoal: _string,
    Parameter: _string,
    ParentCriterionId: _number,
    PartitionType: _string,
    Path1: _string,
    Path2: _string,
    PercentNewVisitors: _number,
    Period: _string,
    PlaceholderType: _number,
    PositionSignificance: _number,
    PostClickQualityScore: _string,
    PrimaryCompanyName: _string,
    ProductCondition: _string,
    ProductGroup: _string,
    ProductTypeL1: _string,
    ProductTypeL2: _string,
    ProductTypeL3: _string,
    ProductTypeL4: _string,
    ProductTypeL5: _string,
    QualityScore: _number,
    Quarter: _string,
    Query: _string,
    QueryMatchType: _string,
    QueryMatchTypeWithVariant: _string,
    ReferenceCount: _number,
    RegionCriteriaId: _number,
    RelativeCtr: _number,
    Scheduling: _json,
    SearchBudgetLostImpressionShare: _number,
    SearchClickShare: _number,
    SearchExactMatchImpressionShare: _number,
    SearchImpressionShare: _number,
    SearchPredictedCtr: _string,
    SearchQuery: _string,
    SearchRankLostImpressionShare: _number,
    SerpType: _string,
    ServingStatus: _string,
    SharedSetId: _number,
    SharedSetName: _string,
    SharedSetType: _string,
    ShortHeadline: _string,
    Slot: _string,
    StartDate: _date,
    StartTime: _date,
    Status: _string,
    StoreId: _string,
    SystemServingStatus: _string,
    SystemStatus: _string,
    TargetCpa: _number,
    TargetCpaBidSource: _string,
    TargetCpaMaxCpcBidCeiling: _number,
    TargetCpaMaxCpcBidFloor: _number,
    TargetingAdGroupId: _number,
    TargetingCampaignId: _number,
    TargetOutrankShare: _number,
    TargetOutrankShareBidChangesForRaisesOnly: _boolean,
    TargetOutrankShareCompetitorDomain: _string,
    TargetOutrankShareMaxCpcBidCeiling: _number,
    TargetOutrankShareRaiseBidWhenLowQualityScore: _boolean,
    TargetRoas: _number,
    TargetRoasBidCeiling: _number,
    TargetRoasBidFloor: _number,
    TargetSpendBidCeiling: _number,
    TargetSpendSpendTarget: _number,
    Title: _string,
    TopOfPageCpc: _number,
    TrackingUrlTemplate: _string,
    Trademarks: _json,
    Type: _string,
    Url: _string,
    UrlCustomParameters: _json,
    UserListId: _number,
    UserListName: _string,
    UserListsCount: _number,
    ValidationDetails: _json,
    ValuePerAllConversion: _number,
    ValuePerConversion: _number,
    VideoChannelId: _string,
    VideoDuration: _number,
    VideoId: _string,
    VideoQuartile100Rate: _number,
    VideoQuartile25Rate: _number,
    VideoQuartile50Rate: _number,
    VideoQuartile75Rate: _number,
    VideoTitle: _string,
    VideoViewRate: _number,
    VideoViews: _number,
    ViewThroughConversions: _number,
    ViewThroughConversionsSignificance: _number,
    Week: _string,
    Year: _number
  };

  /**
   * Maps a row object from AdWordsApp.report with the _columns object.
   * @param  {object} row
   * @param  {array} columnNames
   * @return {object}
   */
  var _mapColumnValues = function(row, columnNames) {
    var result = {};
    columnNames.forEach(function(columnName) {
      if(_columns[columnName] !== undefined) {
        var value = row[columnName];
        result[columnName] = _columns[columnName](value);
      }
    });
    return result;
  };

  /**
   * Set which columns should be used whith our AWQL-query.
   * @param  {string|array} columns
   * @return {object}
   */
  var selectStatement = function(columns) {
    if(Array.isArray(columns)) {
      columns = columns.join(',');
    }
    settings.awqlOptions.select = columns;
    return {
      from: fromStatement
    };
  };

  /**
   * Set which report should be used with our AWQL-query.
   * @param  {string} report
   * @return {object}
   */
  var fromStatement = function(report) {
    settings.awqlOptions.from = report;
    return {
      where: whereStatement,
      and: andStatement,
      during: duringStatement
    };
  };

  /**
   * Set the where statement in our AWQL-query.
   * @param  {string} statement
   * @return {object}
   */
  var whereStatement = function(statement) {
    settings.awqlOptions.where = statement;
    return {
      and: andStatement,
      during: duringStatement
    };
  };

  /**
   * Add an and statment to our AWQL-query.
   * @param  {[type]} statement
   * @return {[type]}           [description]
   */
  var andStatement = function(statement) {
    if(!settings.awqlOptions.and) {
        settings.awqlOptions.and = [];
    }
    if(Array.isArray(statement)) {
      settings.awqlOptions.and = [].contact.apply([],settings.awqlOptions.and, statement);
    } else {
      settings.awqlOptions.and.push(statement);
    }
    return {
      and: andStatement,
      during: duringStatement
    };
  };

  /**
   * Set the during statement in our AWQL-query
   * @param  {string|array} timeframe
   * @return {object}
   */
  var duringStatement = function(timeframe) {
      if(Array.isArray(timeframe)) {
        timeframe = timeframe.join(',');
      }
      settings.awqlOptions.during = timeframe;
      return {
        run: runAWQL
      };
  };

  /**
   * Runs the current AWQL-query with AdWordsApp.report
   * @return {object}
   */
  var runAWQL = function() {
    var finalAWQL = settings.awqlOptions;
    if(typeof settings.awqlOptions === 'object') {
      finalAWQL =
        'SELECT ' +
        settings.awqlOptions.select +
        ' FROM ' +
        settings.awqlOptions.from;
      if(settings.awqlOptions.where) {
        finalAWQL += ' WHERE ' + settings.awqlOptions.where;
      }
      if(settings.awqlOptions.and) {
        finalAWQL += ' AND ' + settings.awqlOptions.and.join(' AND ');
      }
      if(settings.awqlOptions.during) {
        finalAWQL += ' DURING ' + settings.awqlOptions.during;
      }
    } else if (typeof finalAWQL === 'string') {
      finalAWQL = finalAWQL.split(', ').join(',');
    }
    var options = { includeZeroImpressions: settings.zeroImpression };
    settings.awqlOptions = {};
    var report = AdWordsApp.report(finalAWQL, options);

    return parseResult(report);
  };

  /**
   * Check if _tempData has a next row.
   * @return {boolean}
   */
  var hasNextStatement = function() {
    return this.data.length > 0;
  };

  /**
   * Splice the last object from _tempData and returns its value.
   * @return {object}
   */
  var nextRowStatement = function() {
    return this.data.splice(this.data.length-1,1)[0];
  };

  /**
   * Initialize the hasNext and next functionality.
   * @return {object}
   */
  var rowsStatement = function() {
    if(_tempData.length > 0) {
      return {
        hasNext: hasNextStatement,
        next: nextRowStatement,
        data: JSON.parse(JSON.stringify(_tempData))
      };
    } else {
      Logger.log('Cant use .rows() since there are no rows.');
    }
  };

  /**
   * Parse the result from the AdWordsApp.report
   * @param  {object}
   * @return {object}
   */
  var parseResult = function(data) {
    var finalObject = {};
    finalObject.rows = rowsStatement;
    finalObject.data = [];
    var date = new Date().toLocaleDateString();
    if(settings.exportToSheet) {
      var spreadsheet = SpreadsheetApp.create('AdWordsReport - ' + date);
      data.exportToSheet(spreadsheet.getActiveSheet());
      finalObject.sheetUrl = spreadsheet.getUrl();
      finalObject.sheetId = spreadsheet.getId();
      finalObject.sheetName = spreadsheet.getName();
    }
    var rows = data.rows();
    while(rows.hasNext()) {
      var row = rows.next();
      var columnNames = Object.keys(row);
      var result = _mapColumnValues(row, columnNames);
      finalObject.data.push(result);
    }
    _tempData = JSON.parse(JSON.stringify(finalObject.data));
    return finalObject;
  };

  /**
   * Public function to set settings.
   * @param  {Object} options
   * @return {void}
   */
  this.use = function(options) {
    if (typeof options === 'object') {
      if(typeof options.exportToSheet === 'boolean') {
        settings.exportToSheet = options.exportToSheet;
      }
      if(typeof options.zeroImpression === 'boolean') {
        settings.zeroImpression = options.zeroImpression;
      }
      if(typeof options.lowImpressionShare === 'number') {
        settings.lowImpressionShare = options.lowImpressionShare;
      }
    } else {
        throw new Error('Wrong params in .use()');
    }
  };

  /**
   * Public function to initialize select or run a full AWQL-query if passed
   * as an option.
   * @param  {object} options
   * @return {object}
   */
  this.awql = function(options) {
    if(options) {
      settings.awqlOptions = options;
      if(Array.isArray(settings.awqlOptions.select)) {
        settings.awqlOptions.select = settings.awqlOptions.select.join(',');
      }
      if(Array.isArray(settings.awqlOptions.during)) {
        settings.awqlOptions.during = settings.awqlOptions.during.join(',');
      }
      return {
        run: runAWQL
      };
    }
    return {
      select: selectStatement
    };
  };
  return this;
};
