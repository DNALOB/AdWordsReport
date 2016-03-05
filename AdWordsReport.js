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
   * Transform a string in to an array
   * @param  {string} value
   * @return {array}
   */
  var _array = function(value) {
    if(value === '--') {
      return [];
    }
    return value.split(';').map(Function.prototype.call, String.prototype.trim);
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
    AccountCurrencyCode:  _string,
    AccountDescriptiveName:  _string,
    AccountTimeZoneId:  _string,
    ActiveViewCpm:  _number,
    ActiveViewImpressions:  _number,
    AdFormat:  _string,
    AdGroupAdDisapprovalReasons:  _array,
    AdGroupCount:  _number,
    AdGroupCreativesCount:  _number,
    AdGroupCriteriaCount:  _number,
    AdGroupCriterionStatus:  _string,
    AdGroupId:  _string,
    AdGroupName:  _string,
    AdGroupsCount:  _number,
    AdGroupStatus:  _string,
    AdId:  _string,
    AdNetworkType1:  _string,
    AdNetworkType2:  _string,
    AdType:  _string,
    AdvertiserExperimentSegmentationBin:  _string,
    AdvertiserPhoneNumber:  _string,
    AdvertisingChannelSubType:  _string,
    AdvertisingChannelType:  _string,
    AggregatorId:  _string,
    Amount:  _number,
    ApprovalStatus:  _string,
    AssociatedCampaignId:  _string,
    AssociatedCampaignName:  _string,
    AssociatedCampaignStatus:  _string,
    AttributeValues:  _array,
    AverageCpc:  _number,
    AverageCpm:  _number,
    AverageFrequency:  _number,
    AveragePageviews:  _number,
    AveragePosition:  _number,
    AverageTimeOnSite:  _number,
    AvgCostForOfflineInteraction:  _number,
    BenchmarkAverageMaxCpc:  _number,
    BenchmarkCtr:  _number,
    BiddingStrategyId:  _string,
    BiddingStrategyName:  _string,
    BiddingStrategyType:  _string,
    BidModifier:  _number,
    BidType:  _string,
    BounceRate:  _number,
    Brand:  _string,
    BudgetCampaignAssociationStatus:  _string,
    BudgetId:  _string,
    BudgetName:  _string,
    BudgetReferenceCount:  _number,
    BudgetStatus:  _string,
    CallDuration:  _number,
    CallEndTime:  _number,
    CallerCountryCallingCode:  _string,
    CallerNationalDesignatedCode:  _string,
    CallStartTime:  _number,
    CallStatus:  _string,
    CallType:  _string,
    CampaignCount:  _number,
    CampaignId:  _string,
    CampaignName:  _string,
    CampaignsCount:  _number,
    CampaignStatus:  _string,
    CanManageClients:  _string,
    Category0:  _string,
    Category1:  _string,
    Category2:  _string,
    CategoryL1:  _string,
    CategoryL2:  _string,
    CategoryL3:  _string,
    CategoryL4:  _string,
    CategoryL5:  _string,
    CategoryPaths:  _string,
    Channel:  _string,
    ChannelExclusivity:  _string,
    CityCriteriaId:  _string,
    ClickAssistedConversions:  _number,
    ClickAssistedConversionsOverLastClickConversions:  _number,
    ClickAssistedConversionValue:  _number,
    ClickConversionRate:  _number,
    ClickConversionRateSignificance:  _number,
    Clicks:  _number,
    ClickSignificance:  _number,
    ClickType:  _string,
    CombinedAdsOrganicClicks:  _number,
    CombinedAdsOrganicClicksPerQuery:  _number,
    CombinedAdsOrganicQueries:  _number,
    ContentBidCriterionTypeGroup:  _string,
    ContentBudgetLostImpressionShare:  _number,
    ContentImpressionShare:  _number,
    ContentRankLostImpressionShare:  _number,
    ConversionCategoryName:  _string,
    ConversionManyPerClickSignificance:  _number,
    ConversionRateManyPerClick:  _number,
    ConversionRateManyPerClickSignificance:  _number,
    ConversionsManyPerClick:  _number,
    ConversionTrackerId:  _string,
    ConversionTypeName:  _string,
    ConversionValue:  _number,
    ConvertedClicks:  _number,
    ConvertedClicksSignificance:  _number,
    Cost:  _number,
    CostPerConversionManyPerClick:  _number,
    CostPerConversionManyPerClickSignificance:  _number,
    CostPerConvertedClick:  _number,
    CostPerConvertedClickSignificance:  _number,
    CostPerEstimatedTotalConversion:  _number,
    CostSignificance:  _number,
    CountryCriteriaId:  _string,
    CpcBid:  _string,
    CpcBidSource:  _string,
    CpcSignificance:  _number,
    CpmBid:  _number,
    CpmBidSource:  _string,
    CpmSignificance:  _number,
    CreativeApprovalStatus:  _string,
    CreativeDestinationUrl:  _string,
    CreativeFinalAppUrls:  _array,
    CreativeFinalMobileUrls:  _array,
    CreativeFinalUrls:  _array,
    CreativeId:  _string,
    CreativeTrackingUrlTemplate:  _string,
    CreativeUrlCustomParameters:  _string,
    CreativeQualityScore: _number,
    Criteria:  _string,
    CriteriaDestinationUrl:  _string,
    CriteriaId:  _string,
    CriteriaParameters:  _string,
    CriteriaStatus:  _string,
    CriteriaType:  _string,
    CriteriaTypeName:  _string,
    CriterionId:  _string,
    Ctr:  _number,
    CtrSignificance:  _number,
    CustomAttribute0:  _string,
    CustomAttribute1:  _string,
    CustomAttribute2:  _string,
    CustomAttribute3:  _string,
    CustomAttribute4:  _string,
    CustomerDescriptiveName:  _string,
    Date:  _string,
    DayOfWeek:  _string,
    DeliveryMethod:  _string,
    Description1:  _string,
    Description2:  _string,
    DestinationUrl:  _string,
    Device:  _string,
    DevicePreference:  _string,
    DisapprovalShortNames:  _array,
    DisplayName:  _string,
    DisplayUrl:  _string,
    DistanceBucket:  _string,
    Domain:  _string,
    EffectiveDestinationUrl:  _string,
    EndTime:  _string,
    EnhancedCpcEnabled:  _string,
    EstimatedAddClicksAtFirstPositionCpc: _number,
    EstimatedAddCostAtFirstPositionCpc: _number,
    EstimatedCrossDeviceConversions:  _number,
    EstimatedTotalConversionRate:  _number,
    EstimatedTotalConversions:  _number,
    EstimatedTotalConversionValue:  _number,
    EstimatedTotalConversionValuePerClick:  _number,
    EstimatedTotalConversionValuePerCost:  _number,
    ExtensionPlaceholderCreativeId:  _string,
    ExtensionPlaceholderType:  _string,
    ExternalCustomerId:  _string,
    FeedId:  _string,
    FeedItemAttributes:  _array,
    FeedItemEndTime:  _string,
    FeedItemId:  _string,
    FeedItemStartTime:  _string,
    FeedItemStatus:  _string,
    FinalAppUrls:  _array,
    FinalMobileUrls:  _array,
    FinalUrls:  _array,
    FirstPageCpc:  _number,
    FirstPositionCpc: _number,
    GclId:  _string,
    Headline:  _string,
    HourOfDay:  _number,
    Id:  _string,
    ImageAdUrl:  _string,
    ImageCreativeName:  _string,
    ImpressionAssistedConversions:  _number,
    ImpressionAssistedConversionsOverLastClickConversions:  _number,
    ImpressionAssistedConversionValue:  _number,
    ImpressionReach:  _number,
    Impressions:  _number,
    ImpressionSignificance:  _number,
    InvalidClickRate:  _number,
    InvalidClicks:  _number,
    IsAutoOptimized:  _string,
    IsAutoTaggingEnabled:  _string,
    IsBidOnPath:  _string,
    IsBudgetExplicitlyShared:  _string,
    IsNegative:  _string,
    IsPathExcluded:  _string,
    IsRestrict:  _string,
    IsSelfAction:  _string,
    IsTargetingLocation:  _string,
    IsTestAccount:  _string,
    KeywordId:  _string,
    KeywordMatchType:  _string,
    KeywordText:  _string,
    KeywordTextMatchingQuery:  _string,
    LabelId:  _string,
    LabelIds:  _array,
    LabelName:  _string,
    Labels:  _array,
    LanguageCriteriaId:  _string,
    Line1:  _string,
    LocationType:  _string,
    MatchType:  _string,
    MatchTypeWithVariant:  _string,
    MemberCount:  _number,
    MerchantId:  _string,
    MetroCriteriaId:  _string,
    Month:  _string,
    MonthOfYear:  _string,
    MostSpecificCriteriaId:  _string,
    Name:  _string,
    NonRemovedAdGroupCount:  _number,
    NonRemovedAdGroupCriteriaCount:  _number,
    NonRemovedCampaignCount:  _number,
    NumOfflineImpressions:  _number,
    NumOfflineInteractions:  _number,
    OfferId:  _string,
    OfflineInteractionCost:  _number,
    OfflineInteractionRate:  _number,
    OrganicAveragePosition:  _number,
    OrganicClicks:  _number,
    OrganicClicksPerQuery:  _number,
    OrganicImpressions:  _number,
    OrganicImpressionsPerQuery:  _number,
    OrganicQueries:  _number,
    Page:  _number,
    PageOnePromotedBidCeiling:  _number,
    PageOnePromotedBidChangesForRaisesOnly:  _string,
    PageOnePromotedBidModifier:  _number,
    PageOnePromotedRaiseBidWhenBudgetConstrained:  _string,
    PageOnePromotedRaiseBidWhenLowQualityScore:  _string,
    PageOnePromotedStrategyGoal:  _string,
    Parameter:  _string,
    ParentCriterionId:  _string,
    PartitionType:  _string,
    PercentNewVisitors:  _number,
    Period:  _string,
    PlaceholderType:  _number,
    PlacementUrl:  _string,
    PostClickQualityScore: _number,
    PositionSignificance:  _number,
    PrimaryCompanyName:  _string,
    ProductCondition:  _string,
    ProductGroup:  _string,
    ProductTypeL1:  _string,
    ProductTypeL2:  _string,
    ProductTypeL3:  _string,
    ProductTypeL4:  _string,
    ProductTypeL5:  _string,
    QualityScore:  _number,
    Quarter:  _string,
    Query:  _string,
    ReferenceCount:  _number,
    RegionCriteriaId:  _string,
    RelativeCtr:  _number,
    Scheduling:  _string,
    SearchBudgetLostImpressionShare:  _number,
    SearchExactMatchImpressionShare:  _number,
    SearchImpressionShare:  _number,
    SearchPredictedCtr: _number,
    SearchQuery:  _string,
    SearchRankLostImpressionShare:  _number,
    SerpType:  _string,
    ServingStatus:  _string,
    SharedSetId:  _string,
    SharedSetName:  _string,
    SharedSetType:  _string,
    Slot:  _string,
    StartTime:  _string,
    Status:  _string,
    StoreId:  _string,
    TargetCpa:  _number,
    TargetCpaMaxCpcBidCeiling:  _number,
    TargetCpaMaxCpcBidFloor:  _number,
    TargetOutrankShare:  _number,
    TargetOutrankShareBidChangesForRaisesOnly:  _string,
    TargetOutrankShareCompetitorDomain:  _string,
    TargetOutrankShareMaxCpcBidCeiling:  _number,
    TargetOutrankShareRaiseBidWhenLowQualityScore:  _string,
    TargetRoas:  _number,
    TargetRoasBidCeiling:  _number,
    TargetRoasBidFloor:  _number,
    TargetSpendBidCeiling:  _number,
    TargetSpendSpendTarget:  _number,
    Title:  _string,
    TopOfPageCpc:  _number,
    TotalBudget:  _number,
    TotalCost:  _number,
    TrackingUrlTemplate:  _string,
    Trademarks:  _array,
    Type:  _string,
    Url:  _string,
    UrlCustomParameters:  _string,
    UserListId:  _string,
    UserListsCount:  _number,
    ValidationDetails:  _array,
    ValuePerConversionManyPerClick:  _number,
    ValuePerConvertedClick:  _number,
    ValuePerEstimatedTotalConversion:  _number,
    ViewThroughConversions:  _number,
    ViewThroughConversionsSignificance:  _number,
    Week:  _string,
    Year:  _string
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
    _tempData = finalObject.data;
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
