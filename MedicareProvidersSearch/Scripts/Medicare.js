(function () {
    "use strict";

    System.angular.controller('PhysiciansController',
    ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
        var parameters = { tableid: "#physicians-table" };
        var $table = $(parameters.tableid);
        var pagerName = parameters.tableid + '-pager';
        var $caption = '<i class="fa fa-users"></i>&nbsp;'
            + (typeof (parameters.caption) !== 'undefined'
            ? parameters.caption : 'National Physicians List');

        var searchOptions = {
            multipleSearch: true,
            multipleGroup: true,
            recreateFilter: true,
            sopt: ['cn', 'nc', 'eq', 'ne', 'lt', 'le', 'gt', 'ge',
                'bw', 'bn', 'in', 'ni', 'ew', 'en', 'nu', 'nn'],
            showQuery: true,
            overlay: false,
            drag: false,
            resize: false,
            onReset: function () {
                var $table = $(this);

                // reload the grid after reseting the settings
                $table.trigger("reloadGrid", [{ page: 1 }]);

                // reset the filterToolbar
                if ($.isFunction($table[0].clearToolbar)) {
                    $table[0].clearToolbar();
                }
            },
            afterShowSearch: function () {
                $.jgrid.placeSearchDialogAboveGrid({
                    tableid: parameters.tableid,
                    searchOnEnter: true,
                });
            }
        };

        // should be done before the main grid so that the
        // searchOptions' events can be hooked up properly.
        new System.jqGridSearchHistories({
            mainGridTableId: parameters.tableid,
            mainGridSearchOptions: searchOptions,
            loadSearchBoxButton: true,
            saveSearchBoxButton: true
        });

        new System.jqGridLoadSearchSaved({
            tableid: parameters.tableid + "-saved-searches",
            mainGridTableId: parameters.tableid,
            mainGridSearchOptions: searchOptions,
            loadSearchBoxButton: true
        });

        $table.jqGrid({
            caption: $caption,
            url: $table.data('url'),
            datatype: "json",
            prmNames: { id: "NPI" },
            colNames: [
                'NPI',
                'PAC ID',
                'Professional Enrollment ID',
                'First Name',
                'Middle Name',
                'Last Name',
                'Suffix',
                'Credential',
                'Gender',
                'Medical school name',
                'Graduation year',
                'Primary specialty',
                'Secondary specialty 1',
                'Secondary specialty 2',
                'Secondary specialty 3',
                'Secondary specialty 4',
                'All secondary specialties',
                'Organization legal name',
                'Organization DBA name',
                'Group Practice PAC ID',
                'Number of Group Practice members',
                'Line 1 Street Address',
                'Line 2 Street Address',
                'Marker of address line 2 suppression',
                'City',
                'State',
                'Zip Code',
                'Claims based hospital affiliation CCN 1',
                'Claims based hospital affiliation LBN 1',
                'Claims based hospital affiliation CCN 2',
                'Claims based hospital affiliation LBN 2',
                'Claims based hospital affiliation CCN 3',
                'Claims based hospital affiliation LBN 3',
                'Claims based hospital affiliation CCN 4',
                'Claims based hospital affiliation LBN 4',
                'Claims based hospital affiliation CCN 5',
                'Claims based hospital affiliation LBN 5',
                'Professional accepts Medicare Assignment',
                'Participating in eRx',
                'Participating in PQRS',
                'Participating in EHR',
                'Last Modified Date'
            ],
            colModel: [
                { name: 'NPI', width: 70, key: true, fixed: true, search: true, searchtype: 'integer', searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                { name: 'PAC_ID', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Professional_Enrollment_ID', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'First_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Middle_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Last_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Suffix', width: 40, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Credential', width: 40, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Gender', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Medical_school_name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Graduation_year', width: 30, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                { name: 'Primary_specialty', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Secondary_specialty_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Secondary_specialty_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Secondary_specialty_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Secondary_specialty_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'All_secondary_specialties', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Organization_legal_name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Organization_DBA_name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Group_Practice_PAC_ID', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Number_of_Group_Practice_members', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Line_1_Street_Address', width: 50, search: true, editable: false, searchoptions: { searchhidden: true }, hidden: true },
                { name: 'Line_2_Street_Address', width: 50, search: true, editable: false, searchoptions: { searchhidden: true }, hidden: true },
                { name: 'Marker_of_address_line_2_suppression', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'City', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'State', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Zip_Code', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_CCN_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_LBN_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_CCN_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_LBN_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_CCN_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_LBN_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_CCN_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_LBN_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_CCN_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_LBN_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Professional_accepts_Medicare_Assignment', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Participating_in_eRx', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Participating_in_PQRS', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Participating_in_EHR', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'LastModifiedDate', width: 50, search: true, searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'], dataInit: System.getJqGridDefaultDateTimePicker }, cellattr: System.jqGridCellAttrAddTimeago, editable: false, hidden: true }
            ],
            rowNum: 10,
            rowList: [10, 20, 30, 50, 75, 100, 200, 500, 1000],
            pager: pagerName,
            sortname: 'NPI',
            viewrecords: true,
            sortorder: "desc",
            autowidth: true,
            height: 'auto',
            mtype: 'POST',
            jsonReader: {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                userdata: "userdata"
            },
            beforeSelectRow: function (rowid) {
                // allow deselection of a row
                if ($table.jqGrid("getGridParam", "selrow") === rowid) {
                    // de-select the current selected row
                    $table.jqGrid("resetSelection");

                    $timeout(function () { $scope.physician = null; });

                    return false;
                } else {
                    return true;
                }
            },
            onSelectRow: function (rowId, status, e) {
                if (status) {
                    $timeout(function () {
                        $scope.physician = $table.jqGrid('getRowData', rowId);
                    });
                } else {
                    $timeout(function () {
                        $scope.physician = null;
                    });
                }
            },
            beforeRequest: function () {
                // add a the loading time counter to the loading message
                System.startTimer($('#load_' + parameters.tableid.substring(1)));

                showCaption('<i class="fa fa-spinner fa-pulse fa-lg"></i>');

                // reset the physician object for each server request
                $timeout(function () {
                    $scope.physician = null;
                });
            },
            beforeProcessing: function (data, status, xhr) {
                // disable the loading time counter
                System.stopTimer($('#load_' + parameters.tableid.substring(1)));
            },
            loadComplete: function (data) {
                // put the number of records in the title of the grid
                showCaption(data.records, data.records + " records");
            },
            gridComplete: function () {
                // resize the grid when window's resize event triggers
                $.jgrid.resizeOnWindowResizeEvent($(this));
            }
        }).jqGrid('navGrid', pagerName,
            { search: true, view: true, del: false, add: false, edit: false },
            {}, // default settings for edit
            {}, // default settings for add
            {}, // delete instead that del:false we need this
            {
                multipleSearch: true,
                multipleGroup: true,
                recreateFilter: true,
                showQuery: true,
                overlay: false
            }, // search options
            { width: 'auto' } /* view parameters*/
        ).jqGrid('navButtonAdd', pagerName, System.jqGridDefaultColumnChooserOptions)
        .jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: 'cn' })
        .jqGrid('searchGrid', searchOptions); // create the searching dialog

        function showCaption(value, title) {
            var caption = [];
            var $captionPlaceHolder = $('.ui-jqgrid-title', '#gview_'
                + $.jgrid.jqID($(parameters.tableid)[0].id));

            caption.push($caption);
            caption.push('&nbsp;<b class="badge" style="float:right;margin-right:25px;" title="');
            caption.push(title);
            caption.push('">');
            caption.push(value);
            caption.push('</b>');

            $captionPlaceHolder.html(caption.join(''));
        }
    }]);

    System.angular.controller('ProvidersController',
    ['$scope', '$element', '$compile', '$http', '$timeout',
    function ($scope, $element, $compile, $http, $timeout) {
        var controller = $($element);

        $.extend($scope, controller.data('model'));

        var parameters = { tableid: "#providers-table" };
        var $table = $(parameters.tableid);
        var pagerName = parameters.tableid + '-pager';

        var $caption = '<i class="fa fa-users"></i>&nbsp;'
            + (typeof (parameters.caption) !== 'undefined'
            ? parameters.caption : 'Medicare Providers List');

        var searchOptions = {
            multipleSearch: true,
            multipleGroup: true,
            recreateFilter: true,
            sopt: ['cn', 'nc', 'eq', 'ne', 'lt', 'le', 'gt', 'ge',
                'bw', 'bn', 'in', 'ni', 'ew', 'en', 'nu', 'nn'],
            showQuery: true,
            overlay: false,
            drag: false,
            resize: false,
            onReset: function () {
                var $table = $(this);

                // reset the utilization and payments search
                $scope.search.parameters = {};

                // reset the filterToolbar
                if ($.isFunction($table[0].clearToolbar)) {
                    $table[0].clearToolbar();
                }

                // reload the grid after reseting the settings
                // Note: should be done after clearing all the settings
                $table.trigger("reloadGrid", [{ page: 1 }]);

            },
            afterShowSearch: function () {
                var tid = parameters.tableid.substring(1);

                $.jgrid.placeSearchDialogAboveGrid({
                    tableid: parameters.tableid,
                    searchOnEnter: true,
                });

                // create a place to display the query executed time
                $executedTimeMessageBox = $('<div class="pull-right"></div>').appendTo($('#searchhdfbox_' + tid));
            }
        };

        var $postData = null;

        var $executedTimeMessageBox = null;

        var $providerDetail = $('#provider-detail');

        // should be done before the main grid so that the
        // searchOptions' events can be hooked up properly.
        new System.jqGridSearchHistories({
            mainGridTableId: parameters.tableid,
            mainGridSearchOptions: searchOptions,
            loadSearchBoxButton: true,
            saveSearchBoxButton: true
        });

        new System.jqGridLoadSearchSaved({
            mainGridTableId: parameters.tableid,
            mainGridSearchOptions: searchOptions,
            loadSearchBoxButton: true
        });

        $table.jqGrid({
            caption: $caption,
            url: $table.data('url'),
            datatype: "json",
            prmNames: { id: "NPI" },
            postData: { filters: { groupOp: "AND", rules: [] } },
            colNames: [
                'NPI'
                , 'ID'
                , 'Contact ID'
                , 'Institution ID'
                , 'Entity Type Code'
                , 'Replacement NPI'
                , 'Employer Identification Number (EIN)'
                , 'Organization Name'
                , 'Prefix'
                , 'First Name'
                , 'Middle Name'
                , 'Last Name'
                , 'Suffix'
                , 'Credential'
                , 'Gender'
                , 'Provider Other Organization Name'
                , 'Provider Other Organization Name Type Code'
                , 'Provider Other Last Name'
                , 'Provider Other First Name'
                , 'Provider Other Middle Name'
                , 'Provider Other Name Prefix Text'
                , 'Provider Other Name Suffix Text'
                , 'Provider Other Credential Text'
                , 'Provider Other Last Name Type Code'
                , 'Address'
                , 'Address 2'
                , 'City'
                , 'State'
                , 'Postal Code'
                , 'Country Code (If outside US)'
                , 'Telephone Number'
                , 'Fax Number'
                , 'Provider First Line Business Practice Location Address'
                , 'Provider Second Line Business Practice Location Address'
                , 'Provider Business Practice Location Address City Name'
                , 'Provider Business Practice Location Address State Name'
                , 'Provider Business Practice Location Address Postal Code'
                , 'Provider Business Practice Location Address Country Code (If outside US)'
                , 'Provider Business Practice Location Address Telephone Number'
                , 'Provider Business Practice Location Address Fax Number'
                , 'Provider Enumeration Date'
                , 'Last Update Date'
                , 'NPI Deactivation Reason Code'
                , 'NPI Deactivation Date'
                , 'NPI Reactivation Date'
                , 'Authorized Official Last Name'
                , 'Authorized Official First Name'
                , 'Authorized Official Middle Name'
                , 'Authorized Official Title or Position'
                , 'Authorized Official Name Prefix Text'
                , 'Authorized Official Name Suffix Text'
                , 'Authorized Official Credential Text'
                , 'Authorized Official Telephone Number'
                , 'Healthcare Provider Taxonomy Code_1'
                , 'Healthcare Provider Taxonomy Code_Classification_1'
                , 'Healthcare Provider Taxonomy Code_Specialization_1'
                , 'Healthcare Provider Taxonomy Code_Definition_1'
                , 'Provider License Number_1'
                , 'Provider License Number State Code_1'
                , 'Healthcare Provider Primary Taxonomy Switch_1'
                , 'Healthcare Provider Taxonomy Code_2'
                , 'Healthcare Provider Taxonomy Code_Classification_2'
                , 'Healthcare Provider Taxonomy Code_Specialization_2'
                , 'Healthcare Provider Taxonomy Code_Definition_2'
                , 'Provider License Number_2'
                , 'Provider License Number State Code_2'
                , 'Healthcare Provider Primary Taxonomy Switch_2'
                , 'Healthcare Provider Taxonomy Code_3'
                , 'Healthcare Provider Taxonomy Code_Classification_3'
                , 'Healthcare Provider Taxonomy Code_Specialization_3'
                , 'Healthcare Provider Taxonomy Code_Definition_3'
                , 'Provider License Number_3'
                , 'Provider License Number State Code_3'
                , 'Healthcare Provider Primary Taxonomy Switch_3'
                , 'Healthcare Provider Taxonomy Code_4'
                , 'Healthcare Provider Taxonomy Code_Classification_4'
                , 'Healthcare Provider Taxonomy Code_Specialization_4'
                , 'Healthcare Provider Taxonomy Code_Definition_4'
                , 'Provider License Number_4'
                , 'Provider License Number State Code_4'
                , 'Healthcare Provider Primary Taxonomy Switch_4'
                , 'Healthcare Provider Taxonomy Code_5'
                , 'Healthcare Provider Taxonomy Code_Classification_5'
                , 'Healthcare Provider Taxonomy Code_Specialization_5'
                , 'Healthcare Provider Taxonomy Code_Definition_5'
                , 'Provider License Number_5'
                , 'Provider License Number State Code_5'
                , 'Healthcare Provider Primary Taxonomy Switch_5'
                , 'Healthcare Provider Taxonomy Code_6'
                , 'Healthcare Provider Taxonomy Code_Classification_6'
                , 'Healthcare Provider Taxonomy Code_Specialization_6'
                , 'Healthcare Provider Taxonomy Code_Definition_6'
                , 'Provider License Number_6'
                , 'Provider License Number State Code_6'
                , 'Healthcare Provider Primary Taxonomy Switch_6'
                , 'Healthcare Provider Taxonomy Code_7'
                , 'Healthcare Provider Taxonomy Code_Classification_7'
                , 'Healthcare Provider Taxonomy Code_Specialization_7'
                , 'Healthcare Provider Taxonomy Code_Definition_7'
                , 'Provider License Number_7'
                , 'Provider License Number State Code_7'
                , 'Healthcare Provider Primary Taxonomy Switch_7'
                , 'Healthcare Provider Taxonomy Code_8'
                , 'Healthcare Provider Taxonomy Code_Classification_8'
                , 'Healthcare Provider Taxonomy Code_Specialization_8'
                , 'Healthcare Provider Taxonomy Code_Definition_8'
                , 'Provider License Number_8'
                , 'Provider License Number State Code_8'
                , 'Healthcare Provider Primary Taxonomy Switch_8'
                , 'Healthcare Provider Taxonomy Code_9'
                , 'Healthcare Provider Taxonomy Code_Classification_9'
                , 'Healthcare Provider Taxonomy Code_Specialization_9'
                , 'Healthcare Provider Taxonomy Code_Definition_9'
                , 'Provider License Number_9'
                , 'Provider License Number State Code_9'
                , 'Healthcare Provider Primary Taxonomy Switch_9'
                , 'Healthcare Provider Taxonomy Code_10'
                , 'Healthcare Provider Taxonomy Code_Classification_10'
                , 'Healthcare Provider Taxonomy Code_Specialization_10'
                , 'Healthcare Provider Taxonomy Code_Definition_10'
                , 'Provider License Number_10'
                , 'Provider License Number State Code_10'
                , 'Healthcare Provider Primary Taxonomy Switch_10'
                , 'Healthcare Provider Taxonomy Code_11'
                , 'Healthcare Provider Taxonomy Code_Classification_11'
                , 'Healthcare Provider Taxonomy Code_Specialization_11'
                , 'Healthcare Provider Taxonomy Code_Definition_11'
                , 'Provider License Number_11'
                , 'Provider License Number State Code_11'
                , 'Healthcare Provider Primary Taxonomy Switch_11'
                , 'Healthcare Provider Taxonomy Code_12'
                , 'Healthcare Provider Taxonomy Code_Classification_12'
                , 'Healthcare Provider Taxonomy Code_Specialization_12'
                , 'Healthcare Provider Taxonomy Code_Definition_12'
                , 'Provider License Number_12'
                , 'Provider License Number State Code_12'
                , 'Healthcare Provider Primary Taxonomy Switch_12'
                , 'Healthcare Provider Taxonomy Code_13'
                , 'Healthcare Provider Taxonomy Code_Classification_13'
                , 'Healthcare Provider Taxonomy Code_Specialization_13'
                , 'Healthcare Provider Taxonomy Code_Definition_13'
                , 'Provider License Number_13'
                , 'Provider License Number State Code_13'
                , 'Healthcare Provider Primary Taxonomy Switch_13'
                , 'Healthcare Provider Taxonomy Code_14'
                , 'Healthcare Provider Taxonomy Code_Classification_14'
                , 'Healthcare Provider Taxonomy Code_Specialization_14'
                , 'Healthcare Provider Taxonomy Code_Definition_14'
                , 'Provider License Number_14'
                , 'Provider License Number State Code_14'
                , 'Healthcare Provider Primary Taxonomy Switch_14'
                , 'Healthcare Provider Taxonomy Code_15'
                , 'Healthcare Provider Taxonomy Code_Classification_15'
                , 'Healthcare Provider Taxonomy Code_Specialization_15'
                , 'Healthcare Provider Taxonomy Code_Definition_15'
                , 'Provider License Number_15'
                , 'Provider License Number State Code_15'
                , 'Healthcare Provider Primary Taxonomy Switch_15'
                , 'Other Provider Identifier_1'
                , 'Other Provider Identifier Type Code_1'
                , 'Other Provider Identifier State_1'
                , 'Other Provider Identifier Issuer_1'
                , 'Other Provider Identifier_2'
                , 'Other Provider Identifier Type Code_2'
                , 'Other Provider Identifier State_2'
                , 'Other Provider Identifier Issuer_2'
                , 'Other Provider Identifier_3'
                , 'Other Provider Identifier Type Code_3'
                , 'Other Provider Identifier State_3'
                , 'Other Provider Identifier Issuer_3'
                , 'Other Provider Identifier_4'
                , 'Other Provider Identifier Type Code_4'
                , 'Other Provider Identifier State_4'
                , 'Other Provider Identifier Issuer_4'
                , 'Other Provider Identifier_5'
                , 'Other Provider Identifier Type Code_5'
                , 'Other Provider Identifier State_5'
                , 'Other Provider Identifier Issuer_5'
                , 'Other Provider Identifier_6'
                , 'Other Provider Identifier Type Code_6'
                , 'Other Provider Identifier State_6'
                , 'Other Provider Identifier Issuer_6'
                , 'Other Provider Identifier_7'
                , 'Other Provider Identifier Type Code_7'
                , 'Other Provider Identifier State_7'
                , 'Other Provider Identifier Issuer_7'
                , 'Other Provider Identifier_8'
                , 'Other Provider Identifier Type Code_8'
                , 'Other Provider Identifier State_8'
                , 'Other Provider Identifier Issuer_8'
                , 'Other Provider Identifier_9'
                , 'Other Provider Identifier Type Code_9'
                , 'Other Provider Identifier State_9'
                , 'Other Provider Identifier Issuer_9'
                , 'Other Provider Identifier_10'
                , 'Other Provider Identifier Type Code_10'
                , 'Other Provider Identifier State_10'
                , 'Other Provider Identifier Issuer_10'
                , 'Other Provider Identifier_11'
                , 'Other Provider Identifier Type Code_11'
                , 'Other Provider Identifier State_11'
                , 'Other Provider Identifier Issuer_11'
                , 'Other Provider Identifier_12'
                , 'Other Provider Identifier Type Code_12'
                , 'Other Provider Identifier State_12'
                , 'Other Provider Identifier Issuer_12'
                , 'Other Provider Identifier_13'
                , 'Other Provider Identifier Type Code_13'
                , 'Other Provider Identifier State_13'
                , 'Other Provider Identifier Issuer_13'
                , 'Other Provider Identifier_14'
                , 'Other Provider Identifier Type Code_14'
                , 'Other Provider Identifier State_14'
                , 'Other Provider Identifier Issuer_14'
                , 'Other Provider Identifier_15'
                , 'Other Provider Identifier Type Code_15'
                , 'Other Provider Identifier State_15'
                , 'Other Provider Identifier Issuer_15'
                , 'Other Provider Identifier_16'
                , 'Other Provider Identifier Type Code_16'
                , 'Other Provider Identifier State_16'
                , 'Other Provider Identifier Issuer_16'
                , 'Other Provider Identifier_17'
                , 'Other Provider Identifier Type Code_17'
                , 'Other Provider Identifier State_17'
                , 'Other Provider Identifier Issuer_17'
                , 'Other Provider Identifier_18'
                , 'Other Provider Identifier Type Code_18'
                , 'Other Provider Identifier State_18'
                , 'Other Provider Identifier Issuer_18'
                , 'Other Provider Identifier_19'
                , 'Other Provider Identifier Type Code_19'
                , 'Other Provider Identifier State_19'
                , 'Other Provider Identifier Issuer_19'
                , 'Other Provider Identifier_20'
                , 'Other Provider Identifier Type Code_20'
                , 'Other Provider Identifier State_20'
                , 'Other Provider Identifier Issuer_20'
                , 'Other Provider Identifier_21'
                , 'Other Provider Identifier Type Code_21'
                , 'Other Provider Identifier State_21'
                , 'Other Provider Identifier Issuer_21'
                , 'Other Provider Identifier_22'
                , 'Other Provider Identifier Type Code_22'
                , 'Other Provider Identifier State_22'
                , 'Other Provider Identifier Issuer_22'
                , 'Other Provider Identifier_23'
                , 'Other Provider Identifier Type Code_23'
                , 'Other Provider Identifier State_23'
                , 'Other Provider Identifier Issuer_23'
                , 'Other Provider Identifier_24'
                , 'Other Provider Identifier Type Code_24'
                , 'Other Provider Identifier State_24'
                , 'Other Provider Identifier Issuer_24'
                , 'Other Provider Identifier_25'
                , 'Other Provider Identifier Type Code_25'
                , 'Other Provider Identifier State_25'
                , 'Other Provider Identifier Issuer_25'
                , 'Other Provider Identifier_26'
                , 'Other Provider Identifier Type Code_26'
                , 'Other Provider Identifier State_26'
                , 'Other Provider Identifier Issuer_26'
                , 'Other Provider Identifier_27'
                , 'Other Provider Identifier Type Code_27'
                , 'Other Provider Identifier State_27'
                , 'Other Provider Identifier Issuer_27'
                , 'Other Provider Identifier_28'
                , 'Other Provider Identifier Type Code_28'
                , 'Other Provider Identifier State_28'
                , 'Other Provider Identifier Issuer_28'
                , 'Other Provider Identifier_29'
                , 'Other Provider Identifier Type Code_29'
                , 'Other Provider Identifier State_29'
                , 'Other Provider Identifier Issuer_29'
                , 'Other Provider Identifier_30'
                , 'Other Provider Identifier Type Code_30'
                , 'Other Provider Identifier State_30'
                , 'Other Provider Identifier Issuer_30'
                , 'Other Provider Identifier_31'
                , 'Other Provider Identifier Type Code_31'
                , 'Other Provider Identifier State_31'
                , 'Other Provider Identifier Issuer_31'
                , 'Other Provider Identifier_32'
                , 'Other Provider Identifier Type Code_32'
                , 'Other Provider Identifier State_32'
                , 'Other Provider Identifier Issuer_32'
                , 'Other Provider Identifier_33'
                , 'Other Provider Identifier Type Code_33'
                , 'Other Provider Identifier State_33'
                , 'Other Provider Identifier Issuer_33'
                , 'Other Provider Identifier_34'
                , 'Other Provider Identifier Type Code_34'
                , 'Other Provider Identifier State_34'
                , 'Other Provider Identifier Issuer_34'
                , 'Other Provider Identifier_35'
                , 'Other Provider Identifier Type Code_35'
                , 'Other Provider Identifier State_35'
                , 'Other Provider Identifier Issuer_35'
                , 'Other Provider Identifier_36'
                , 'Other Provider Identifier Type Code_36'
                , 'Other Provider Identifier State_36'
                , 'Other Provider Identifier Issuer_36'
                , 'Other Provider Identifier_37'
                , 'Other Provider Identifier Type Code_37'
                , 'Other Provider Identifier State_37'
                , 'Other Provider Identifier Issuer_37'
                , 'Other Provider Identifier_38'
                , 'Other Provider Identifier Type Code_38'
                , 'Other Provider Identifier State_38'
                , 'Other Provider Identifier Issuer_38'
                , 'Other Provider Identifier_39'
                , 'Other Provider Identifier Type Code_39'
                , 'Other Provider Identifier State_39'
                , 'Other Provider Identifier Issuer_39'
                , 'Other Provider Identifier_40'
                , 'Other Provider Identifier Type Code_40'
                , 'Other Provider Identifier State_40'
                , 'Other Provider Identifier Issuer_40'
                , 'Other Provider Identifier_41'
                , 'Other Provider Identifier Type Code_41'
                , 'Other Provider Identifier State_41'
                , 'Other Provider Identifier Issuer_41'
                , 'Other Provider Identifier_42'
                , 'Other Provider Identifier Type Code_42'
                , 'Other Provider Identifier State_42'
                , 'Other Provider Identifier Issuer_42'
                , 'Other Provider Identifier_43'
                , 'Other Provider Identifier Type Code_43'
                , 'Other Provider Identifier State_43'
                , 'Other Provider Identifier Issuer_43'
                , 'Other Provider Identifier_44'
                , 'Other Provider Identifier Type Code_44'
                , 'Other Provider Identifier State_44'
                , 'Other Provider Identifier Issuer_44'
                , 'Other Provider Identifier_45'
                , 'Other Provider Identifier Type Code_45'
                , 'Other Provider Identifier State_45'
                , 'Other Provider Identifier Issuer_45'
                , 'Other Provider Identifier_46'
                , 'Other Provider Identifier Type Code_46'
                , 'Other Provider Identifier State_46'
                , 'Other Provider Identifier Issuer_46'
                , 'Other Provider Identifier_47'
                , 'Other Provider Identifier Type Code_47'
                , 'Other Provider Identifier State_47'
                , 'Other Provider Identifier Issuer_47'
                , 'Other Provider Identifier_48'
                , 'Other Provider Identifier Type Code_48'
                , 'Other Provider Identifier State_48'
                , 'Other Provider Identifier Issuer_48'
                , 'Other Provider Identifier_49'
                , 'Other Provider Identifier Type Code_49'
                , 'Other Provider Identifier State_49'
                , 'Other Provider Identifier Issuer_49'
                , 'Other Provider Identifier_50'
                , 'Other Provider Identifier Type Code_50'
                , 'Other Provider Identifier State_50'
                , 'Other Provider Identifier Issuer_50'
                , 'Is Sole Proprietor'
                , 'Is Organization Subpart'
                , 'Parent Organization LBN'
                , 'Parent Organization TIN'
                , 'Healthcare Provider Taxonomy Group_1'
                , 'Healthcare Provider Taxonomy Group_2'
                , 'Healthcare Provider Taxonomy Group_3'
                , 'Healthcare Provider Taxonomy Group_4'
                , 'Healthcare Provider Taxonomy Group_5'
                , 'Healthcare Provider Taxonomy Group_6'
                , 'Healthcare Provider Taxonomy Group_7'
                , 'Healthcare Provider Taxonomy Group_8'
                , 'Healthcare Provider Taxonomy Group_9'
                , 'Healthcare Provider Taxonomy Group_10'
                , 'Healthcare Provider Taxonomy Group_11'
                , 'Healthcare Provider Taxonomy Group_12'
                , 'Healthcare Provider Taxonomy Group_13'
                , 'Healthcare Provider Taxonomy Group_14'
                , 'Healthcare Provider Taxonomy Group_15',
                'PAC ID',
                'Professional Enrollment ID',
                'Medical school name',
                'Graduation year',
                'Primary specialty',
                'Secondary specialty 1',
                'Secondary specialty 2',
                'Secondary specialty 3',
                'Secondary specialty 4',
                'All secondary specialties',
                'Organization legal name',
                'Organization DBA name',
                'Group Practice PAC ID',
                'Number of Group Practice members',
                'Phone Number',
                'Claims based hospital affiliation CCN 1',
                'Claims based hospital affiliation LBN 1',
                'Claims based hospital affiliation CCN 2',
                'Claims based hospital affiliation LBN 2',
                'Claims based hospital affiliation CCN 3',
                'Claims based hospital affiliation LBN 3',
                'Claims based hospital affiliation CCN 4',
                'Claims based hospital affiliation LBN 4',
                'Claims based hospital affiliation CCN 5',
                'Claims based hospital affiliation LBN 5',
                'Professional accepts Medicare Assignment',
                'Participating in eRx',
                'Participating in PQRS',
                'Participating in EHR'
            ],
            colModel: [
                { name: 'NPI', width: 70, key: true, fixed: true, search: true, searchtype: 'integer', searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                { name: 'ID', width: 70, fixed: true, search: false, editable: false, formatter: System.medicareProviderIdFormatter },
                { name: 'ContactID', width: 50, fixed: true, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn'] }, editable: false, hidden: true },
                { name: 'InstitutionID', width: 50, fixed: true, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn'] }, editable: false, hidden: true },
                { name: 'Entity_Type_Code', width: 10, search: true, stype: "select", searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'nu', 'nn'], value: ':;2:Organization;1:Individual' }, editable: false, hidden: true },
                { name: 'Replacement_NPI', width: 70, fixed: true, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Employer_Identification_Number__EIN_', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Organization_Name__Legal_Business_Name_', width: 70, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Provider_Name_Prefix_Text', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_First_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Provider_Middle_Name', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Provider_Last_Name__Legal_Name_', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Provider_Name_Suffix_Text', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Credential_Text', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Provider_Gender_Code', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Provider_Other_Organization_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Other_Organization_Name_Type_Code', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Other_Last_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Other_First_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Other_Middle_Name', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Other_Name_Prefix_Text', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Other_Name_Suffix_Text', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Other_Credential_Text', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Other_Last_Name_Type_Code', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_First_Line_Business_Mailing_Address', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Second_Line_Business_Mailing_Address', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Business_Mailing_Address_City_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Provider_Business_Mailing_Address_State_Name', width: 15, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Provider_Business_Mailing_Address_Postal_Code', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Business_Mailing_Address_Country_Code__If_outside_US_', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Business_Mailing_Address_Telephone_Number', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Business_Mailing_Address_Fax_Number', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_First_Line_Business_Practice_Location_Address', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Second_Line_Business_Practice_Location_Address', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Business_Practice_Location_Address_City_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Business_Practice_Location_Address_State_Name', width: 15, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Business_Practice_Location_Address_Postal_Code', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Business_Practice_Location_Address_Country_Code__If_outside_US_', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Business_Practice_Location_Address_Telephone_Number', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Business_Practice_Location_Address_Fax_Number', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_Enumeration_Date', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Last_Update_Date', width: 50, search: true, searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'], dataInit: System.getJqGridDefaultDateTimePicker }, cellattr: System.jqGridCellAttrAddTimeago, editable: false, hidden: true },
                { name: 'NPI_Deactivation_Reason_Code', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'NPI_Deactivation_Date', width: 50, search: true, searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'], dataInit: System.getJqGridDefaultDateTimePicker }, cellattr: System.jqGridCellAttrAddTimeago, editable: false, hidden: true },
                { name: 'NPI_Reactivation_Date', width: 50, search: true, searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'], dataInit: System.getJqGridDefaultDateTimePicker }, cellattr: System.jqGridCellAttrAddTimeago, editable: false, hidden: true },
                { name: 'Authorized_Official_Last_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Authorized_Official_First_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Authorized_Official_Middle_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Authorized_Official_Title_or_Position', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Authorized_Official_Name_Prefix_Text', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Authorized_Official_Name_Suffix_Text', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Authorized_Official_Credential_Text', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Authorized_Official_Telephone_Number', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_6', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_6', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_6', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_6', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_6', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_6', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_6', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_7', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_7', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_7', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_7', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_7', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_7', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_7', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_8', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_8', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_8', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_8', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_8', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_8', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_8', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_9', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_9', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_9', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_9', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_9', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_9', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_9', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_10', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_10', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_10', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_10', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_10', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_10', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_10', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_11', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_11', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_11', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_11', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_11', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_11', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_11', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_12', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_12', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_12', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_12', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_12', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_12', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_12', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_13', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_13', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_13', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_13', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_13', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_13', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_13', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_14', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_14', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_14', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_14', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_14', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_14', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_14', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_15', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Classification_15', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Specialization_15', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Code_Definition_15', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_15', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Provider_License_Number_State_Code_15', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Primary_Taxonomy_Switch_15', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_6', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_6', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_6', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_6', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_7', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_7', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_7', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_7', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_8', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_8', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_8', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_8', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_9', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_9', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_9', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_9', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_10', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_10', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_10', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_10', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_11', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_11', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_11', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_11', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_12', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_12', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_12', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_12', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_13', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_13', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_13', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_13', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_14', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_14', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_14', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_14', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_15', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_15', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_15', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_15', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_16', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_16', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_16', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_16', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_17', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_17', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_17', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_17', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_18', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_18', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_18', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_18', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_19', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_19', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_19', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_19', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_20', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_20', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_20', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_20', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_21', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_21', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_21', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_21', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_22', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_22', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_22', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_22', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_23', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_23', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_23', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_23', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_24', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_24', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_24', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_24', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_25', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_25', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_25', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_25', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_26', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_26', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_26', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_26', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_27', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_27', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_27', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_27', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_28', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_28', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_28', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_28', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_29', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_29', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_29', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_29', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_30', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_30', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_30', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_30', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_31', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_31', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_31', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_31', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_32', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_32', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_32', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_32', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_33', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_33', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_33', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_33', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_34', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_34', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_34', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_34', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_35', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_35', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_35', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_35', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_36', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_36', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_36', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_36', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_37', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_37', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_37', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_37', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_38', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_38', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_38', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_38', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_39', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_39', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_39', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_39', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_40', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_40', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_40', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_40', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_41', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_41', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_41', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_41', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_42', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_42', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_42', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_42', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_43', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_43', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_43', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_43', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_44', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_44', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_44', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_44', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_45', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_45', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_45', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_45', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_46', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_46', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_46', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_46', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_47', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_47', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_47', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_47', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_48', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_48', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_48', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_48', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_49', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_49', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_49', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_49', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_50', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Type_Code_50', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_State_50', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Other_Provider_Identifier_Issuer_50', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Is_Sole_Proprietor', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Is_Organization_Subpart', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Parent_Organization_LBN', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Parent_Organization_TIN', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_6', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_7', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_8', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_9', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_10', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_11', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_12', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_13', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_14', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Healthcare_Provider_Taxonomy_Group_15', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                // Physician
                //-------------------------------------------------------------------------
                { name: 'PAC_ID', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Professional_Enrollment_ID', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Medical_school_name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Graduation_year', width: 30, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                { name: 'Primary_specialty', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                { name: 'Secondary_specialty_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Secondary_specialty_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Secondary_specialty_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Secondary_specialty_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'All_secondary_specialties', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Organization_legal_name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Organization_DBA_name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Group_Practice_PAC_ID', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Number_of_Group_Practice_members', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Phone_Number', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_CCN_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_LBN_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_CCN_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_LBN_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_CCN_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_LBN_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_CCN_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_LBN_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_CCN_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Claims_based_hospital_affiliation_LBN_5', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Professional_accepts_Medicare_Assignment', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Participating_in_eRx', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Participating_in_PQRS', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                { name: 'Participating_in_EHR', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true }
                //-------------------------------------------------------------------------
            ],
            rowNum: 10,
            rowList: [10, 20, 30, 50, 75, 100, 200, 500, 1000],
            pager: pagerName,
            sortname: 'NPI',
            viewrecords: true,
            sortorder: "desc",
            autowidth: true,
            height: 'auto',
            mtype: 'POST',
            jsonReader: {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                userdata: "userdata"
            },
            beforeSelectRow: function (rowid) {
                // allow deselection of a row
                if ($table.jqGrid("getGridParam", "selrow") === rowid) {
                    // de-select the current selected row
                    $table.jqGrid("resetSelection");

                    $timeout(function () {
                        $scope.provider = null;
                    });

                    return false;
                } else {
                    return true;
                }
            },
            onSelectRow: function (rowId, status, e) {
                if (status) {
                    $scope.$apply(function () {
                        $scope.provider = $table.jqGrid('getRowData', rowId);

                        // jump to the detail page
                        System.animateToElement($providerDetail);

                        // correct jqGrid table widths
                        $timeout(function () {
                            $(window).trigger('resize');
                        });
                    });
                } else {
                    $scope.$apply(function () {
                        $scope.provider = null;
                    });
                }
            },
            beforeRequest: function () {
                // add a the loading time counter to the loading message
                System.startTimer($('#load_' + parameters.tableid.substring(1)));

                // clear the executed time message
                if ($executedTimeMessageBox) {
                    $executedTimeMessageBox.html($('<span/>')
                        .addClass('ui-state-highlight')
                        .html('<i class="fa fa-spinner fa-pulse"></i>&nbsp;Processing...'));
                }

                // clear the provider object for each server request
                $timeout(function () {
                    $scope.provider = null;
                });
            },
            serializeGridData: function (data) {
                $postData = $.extend(data, { searchUtilizationAndPayments: $scope.search.parameters });

                return $postData;
            },
            beforeProcessing: function (data, status, xhr) {
                //------------------------------------------------------
                // disable the loading time counter
                var loading = $('#load_' + parameters.tableid.substring(1));
                System.stopTimer(loading);

                // display the executed time
                if ($executedTimeMessageBox) {
                    var timeString = loading.text();
                    if (!timeString.match('^Loading')) {
                        $executedTimeMessageBox.html(
                            "Last query completed in " + timeString);
                    }
                }
                //------------------------------------------------------
            },
            loadComplete: function (data) {
                
            },
            loadError: function (xhr, status, error) {
                // display the error message
                if ($executedTimeMessageBox) {
                    var statusCode = xhr.status;

                    // skip displaying the error message dialog
                    xhr.status = 0;

                    $executedTimeMessageBox.html(
                        $('<span/>')
                        .addClass('ui-state-error')
                        .html(error)
                        .attr('title', 'click to see detail')
                        .css('cursor', 'pointer')
                        .click(function () {
                            xhr.status = statusCode;
                            System.displayErrorMessage({ xhr: xhr });
                        })
                    );
                }
            },
            gridComplete: function () {
                // resize the grid when window's resize event triggers
                $.jgrid.resizeOnWindowResizeEvent($(this));

                $timeout(function () {
                    // open the detail page by default
                    $('form', $providerDetail).accordion("option", "active", 0);
                });
            }
        }).jqGrid('navGrid', pagerName,
            { search: false, view: true, del: false, add: false, edit: false },
            {}, // default settings for edit
            {}, // default settings for add
            {}, // delete instead that del:false we need this
            {}, // search options
            { width: 'auto' } /* view parameters*/
        ).jqGrid('navButtonAdd', pagerName, System.jqGridDefaultColumnChooserOptions)
        .jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: 'cn' })
        .jqGrid('searchGrid', searchOptions); // create the searching dialog

        $table.jqGrid('navButtonAdd', pagerName, {
            caption: "",
            title: "Export to a CSV file",
            buttonicon: "ui-icon-disk",
            onClickButton: function () {
                System.directPOST($table.getGridParam('url'),
                    $.extend({ save: true }, $postData));
            },
            position: "last"
        });

        $scope.search.submit = function () {
            $table.jqGrid('setGridParam', { search: true }).trigger('reloadGrid', [{ page: 1 }]);
        };
    }])
    .directive('nineDigitZipcodeFormatter', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var $element = $(element);

                scope.$watch("provider", function () {
                    $timeout(function () {
                        var zipcodeValue = $element.text();

                        if (zipcodeValue.length === 9) {
                            $element.text(zipcodeValue.substring(0, 5)
                                + '-' + zipcodeValue.substring(5, 9));
                        }
                    });
                });

            }
        };
    }])
    .directive('tenDigitPhoneFormatter', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var $element = $(element);

                scope.$watch("provider", function () {
                    $timeout(function () {
                        var phoneValue = $element.text();

                        if (phoneValue.length === 10) {
                            $element.text('(' + phoneValue.substring(0, 3) + ') '
                            + phoneValue.substring(3, 6) + '-' + phoneValue.substring(6, 10));
                        }
                    });
                });

            }
        };
    }])
    .directive('dateFormatter', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var $element = $(element);

                scope.$watch("provider", function () {
                    $timeout(function () {
                        var dateValue = $element.text();

                        if (dateValue.length >= 10) {
                            $element.text(dateValue.substring(0, 10));
                        }
                    });
                });

            }
        };
    }])
    .directive('countryCodeToNameFormatter', ['$timeout', '$filter', function ($timeout, $filter) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var $element = $(element);

                scope.$watch("provider", function () {
                    $timeout(function () {
                        var countryCode = $element.text();

                        if (countryCode.length != 2) { return; }

                        var dictionary = System.getCountryDictionary();

                        var countryName = dictionary[countryCode];

                        if (typeof countryName === 'undefined') { return; }

                        $element.text($filter('uppercase')(countryName));
                    });
                });
            }
        };
    }])
    .directive('medicareProviderAggregates', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var tableName = "#medicare-provider-aggregates-" + System.nextUniqueID();
                var pagerName = tableName + '-pager';
                var options = scope.$eval(attr.medicareProviderAggregates);
                var $table = $(element);

                $table.attr('ID', tableName.substring(1));

                // create the pager element
                $('<div/>').attr('ID', pagerName.substring(1)).insertAfter($table);

                // initialize default options
                if (typeof options === 'undefined') { options = {}; }

                var $caption = '<i class="fa fa-usd"></i>&nbsp;'
                    + (typeof (options.caption) !== 'undefined'
                    ? options.caption : 'Medicare Payment Aggregates');

                var searchOptions = {
                    multipleSearch: true,
                    multipleGroup: true,
                    recreateFilter: true,
                    showQuery: true,
                    overlay: false,
                    drag: false,
                    resize: false,
                    afterShowSearch: function () {
                        $.jgrid.placeSearchDialogAboveGrid({
                            tableid: tableName,
                            searchOnEnter: true,
                        });
                    }
                };

                if (options.showSearchHistories) {
                    // should be done before the main grid so that the
                    // searchOptions' events can be hooked up properly.
                    new System.jqGridSearchHistories({
                        mainGridTableId: tableName,
                        mainGridSearchOptions: searchOptions,
                        loadSearchBoxButton: true,
                        saveSearchBoxButton: true
                    });

                    new System.jqGridLoadSearchSaved({
                        mainGridTableId: tableName,
                        mainGridSearchOptions: searchOptions,
                        loadSearchBoxButton: true
                    });
                }

                var colNames = [
                    'npi'
                    , 'year'
                    , 'number_of_hcpcs'
                    , 'total_services'
                    , 'total_unique_benes'
                    , 'total_submitted_chrg_amt'
                    , 'total_medicare_allowed_amt'
                    , 'total_medicare_payment_amt'
                    , 'total_medicare_stnd_amt'
                    , 'drug_suppress_indicator'
                    , 'number_of_drug_hcpcs'
                    , 'total_drug_services'
                    , 'total_drug_unique_benes'
                    , 'total_drug_submitted_chrg_amt'
                    , 'total_drug_medicare_allowed_amt'
                    , 'total_drug_medicare_payment_amt'
                    , 'total_drug_medicare_stnd_amt'
                    , 'med_suppress_indicator'
                    , 'number_of_med_hcpcs'
                    , 'total_med_services'
                    , 'total_med_unique_benes'
                    , 'total_med_submitted_chrg_amt'
                    , 'total_med_medicare_allowed_amt'
                    , 'total_med_medicare_payment_amt'
                    , 'total_med_medicare_stnd_amt'
                    , 'beneficiary_average_age'
                    , 'beneficiary_age_less_65_count'
                    , 'beneficiary_age_65_74_count'
                    , 'beneficiary_age_75_84_count'
                    , 'beneficiary_age_greater_84_count'
                    , 'beneficiary_female_count'
                    , 'beneficiary_male_count'
                    , 'beneficiary_race_white_count'
                    , 'beneficiary_race_black_count'
                    , 'beneficiary_race_api_count'
                    , 'beneficiary_race_hispanic_count'
                    , 'beneficiary_race_natind_count'
                    , 'beneficiary_race_other_count'
                    , 'beneficiary_nondual_count'
                    , 'beneficiary_dual_count'
                    , 'beneficiary_cc_afib_percent'
                    , 'beneficiary_cc_alzrdsd_percent'
                    , 'beneficiary_cc_asthma_percent'
                    , 'beneficiary_cc_cancer_percent'
                    , 'beneficiary_cc_chf_percent'
                    , 'beneficiary_cc_ckd_percent'
                    , 'beneficiary_cc_copd_percent'
                    , 'beneficiary_cc_depr_percent'
                    , 'beneficiary_cc_diab_percent'
                    , 'beneficiary_cc_hyperl_percent'
                    , 'beneficiary_cc_hypert_percent'
                    , 'beneficiary_cc_ihd_percent'
                    , 'beneficiary_cc_ost_percent'
                    , 'beneficiary_cc_raoa_percent'
                    , 'beneficiary_cc_schiot_percent'
                    , 'beneficiary_cc_strk_percent'
                    , 'beneficiary_average_risk_score'
	                , 'Entity Type Code'
	                , 'Provider Organization Name (Legal Business Name)'
	                , 'Provider Last Name (Legal Name)'
	                , 'Provider First Name'
	                , 'Provider Middle Name'
	                , 'Provider Name Prefix Text'
	                , 'Provider Name Suffix Text'
	                , 'Provider Credential Text'
	                , 'Provider First Line Business Mailing Address'
	                , 'Provider Second Line Business Mailing Address'
	                , 'Provider Business Mailing Address City Name'
	                , 'Provider Business Mailing Address State Name'
	                , 'Provider Business Mailing Address Postal Code'
	                , 'Provider Business Mailing Address Country Code (If outside US)'
	                , 'Provider Business Mailing Address Telephone Number'
	                , 'Provider Business Mailing Address Fax Number'
	                , 'Provider First Line Business Practice Location Address'
	                , 'Provider Second Line Business Practice Location Address'
	                , 'Provider Business Practice Location Address City Name'
	                , 'Provider Business Practice Location Address State Name'
	                , 'Provider Business Practice Location Address Postal Code'
	                , 'Provider Business Practice Location Address Country Code (If outside US)'
	                , 'Provider Business Practice Location Address Telephone Number'
	                , 'Provider Business Practice Location Address Fax Number'
	                , 'Primary specialty'
	                , 'All secondary specialties'
                ];

                var colModel = [
                    { name: 'npi', width: 70, key: true, fixed: true, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'year', width: 35, fixed: true, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'number_of_hcpcs', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'total_services', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'total_unique_benes', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'total_submitted_chrg_amt', width: 10, formatter: 'currency', formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ " }, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'total_medicare_allowed_amt', width: 10, formatter: 'currency', formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ " }, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'total_medicare_payment_amt', width: 10, formatter: 'currency', formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ " }, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'total_medicare_stnd_amt', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'drug_suppress_indicator', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'number_of_drug_hcpcs', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'total_drug_services', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'total_drug_unique_benes', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'total_drug_submitted_chrg_amt', width: 10, formatter: 'currency', formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ " }, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'total_drug_medicare_allowed_amt', width: 10, formatter: 'currency', formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ " }, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'total_drug_medicare_payment_amt', width: 10, formatter: 'currency', formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ " }, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'total_drug_medicare_stnd_amt', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'med_suppress_indicator', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'number_of_med_hcpcs', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'total_med_services', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'total_med_unique_benes', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'total_med_submitted_chrg_amt', width: 10, formatter: 'currency', formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ " }, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'total_med_medicare_allowed_amt', width: 10, formatter: 'currency', formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ " }, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'total_med_medicare_payment_amt', width: 10, formatter: 'currency', formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ " }, search: true, searchoptions: { searchhidden: true }, editable: false },
                    { name: 'total_med_medicare_stnd_amt', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_average_age', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_age_less_65_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_age_65_74_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_age_75_84_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_age_greater_84_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_female_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_male_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_race_white_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_race_black_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_race_api_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_race_hispanic_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_race_natind_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_race_other_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_nondual_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_dual_count', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_afib_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_alzrdsd_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_asthma_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_cancer_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_chf_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_ckd_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_copd_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_depr_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_diab_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_hyperl_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_hypert_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_ihd_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_ost_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_raoa_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_schiot_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_cc_strk_percent', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'beneficiary_average_risk_score', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Entity_Type_Code', width: 5, search: true, stype: "select", searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'nu', 'nn'], value: ':;2:Organization;1:Individual' }, editable: false, hidden: true },
                    { name: 'Provider_Organization_Name__Legal_Business_Name_', width: 70, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Last_Name__Legal_Name_', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_First_Name', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Middle_Name', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Name_Prefix_Text', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Name_Suffix_Text', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Credential_Text', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_First_Line_Business_Mailing_Address', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Second_Line_Business_Mailing_Address', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Mailing_Address_City_Name', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Mailing_Address_State_Name', width: 15, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Mailing_Address_Postal_Code', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Mailing_Address_Country_Code__If_outside_US_', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Mailing_Address_Telephone_Number', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Mailing_Address_Fax_Number', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_First_Line_Business_Practice_Location_Address', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Second_Line_Business_Practice_Location_Address', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Practice_Location_Address_City_Name', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Practice_Location_Address_State_Name', width: 15, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Practice_Location_Address_Postal_Code', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Practice_Location_Address_Country_Code__If_outside_US_', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Practice_Location_Address_Telephone_Number', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Practice_Location_Address_Fax_Number', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Primary_specialty', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'All_secondary_specialties', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true }
                ];

                $.each(options.colModel, function (index, specifiedValue) {
                    for (var i = 0; i < colModel.length; i++) {
                        var originalValue = colModel[i];

                        if (specifiedValue.name === originalValue.name) {
                            $.extend(originalValue, specifiedValue);
                        }
                    }
                });

                $table.jqGrid({
                    caption: $caption,
                    url: $table.data('url'),
                    datatype: "json",
                    prmNames: { id: "npi" },
                    colNames: colNames,
                    colModel: colModel,
                    rowNum: 10,
                    rowList: [10, 20, 30, 50, 75, 100, 200, 500, 1000],
                    pager: pagerName,
                    sortname: 'number_of_hcpcs',
                    viewrecords: true,
                    sortorder: "desc",
                    autowidth: true,
                    height: 'auto',
                    mtype: 'POST',
                    jsonReader: {
                        root: "rows",
                        page: "page",
                        total: "total",
                        records: "records",
                        repeatitems: false,
                        userdata: "userdata"
                    },
                    beforeRequest: function () {
                        // clear the old data
                        $table.jqGrid('clearGridData');
                    },
                    gridComplete: function () {
                        // resize the grid when window's resize event triggers
                        $.jgrid.resizeOnWindowResizeEvent($(this));

                        var baseUrl = $table.data('url');

                        scope.$watch("provider", function () {
                            if (!scope.provider) { return; }

                            if (scope.provider.NPI <= 0) { return; }

                            if (!baseUrl.endsWith('/0')) { return; }

                            $table.jqGrid('setGridParam', {
                                url: baseUrl.substring(0, baseUrl.length - 1) + scope.provider.NPI,
                                page: 1
                            }).trigger("reloadGrid");
                        });
                    }
                }).jqGrid('navGrid', pagerName,
                    { search: true, view: true, del: false, add: false, edit: false },
                    {}, // default settings for edit
                    {}, // default settings for add
                    {}, // delete instead that del:false we need this
                    searchOptions, // search options
                    { width: 'auto' } /* view parameters*/
                ).jqGrid('navButtonAdd', pagerName, System.jqGridDefaultColumnChooserOptions)
                .jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: 'cn' });

                $table.jqGrid('navButtonAdd', pagerName, {
                    caption: "",
                    title: "Export to a CSV file",
                    buttonicon: "ui-icon-disk",
                    onClickButton: function () {
                        System.directPOST($table.getGridParam('url'),
                            $.extend({ save: true }, $table.getGridParam("postData")));
                    },
                    position: "last"
                });

                // create the searching dialog
                if (options.showSearchDialog) {
                    $table.jqGrid('searchGrid', searchOptions);
                }
            }
        };
    }])
    .directive('medicareProviderUtilizationPayments', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var tableName = "#medicare-provider-utilization-payments-" + System.nextUniqueID();
                var pagerName = tableName + '-pager';
                var options = scope.$eval(attr.medicareProviderUtilizationPayments);
                var $table = $(element);

                $table.attr('ID', tableName.substring(1));

                // create the pager element
                $('<div/>').attr('ID', pagerName.substring(1)).insertAfter($table);

                // initialize default options
                if (typeof options === 'undefined') { options = {}; }

                var $caption = '<i class="fa fa-cogs"></i>&nbsp;'
                    + (typeof (options.caption) !== 'undefined'
                    ? options.caption : 'Medicare Utilization and Payments');

                var searchOptions = {
                    multipleSearch: true,
                    multipleGroup: true,
                    recreateFilter: true,
                    showQuery: true,
                    overlay: false,
                    drag: false,
                    resize: false,
                    afterShowSearch: function () {
                        $.jgrid.placeSearchDialogAboveGrid({
                            tableid: tableName,
                            searchOnEnter: true,
                        });
                    }
                };

                if (options.showSearchHistories) {
                    // should be done before the main grid so that the
                    // searchOptions' events can be hooked up properly.
                    new System.jqGridSearchHistories({
                        mainGridTableId: tableName,
                        mainGridSearchOptions: searchOptions,
                        loadSearchBoxButton: true,
                        saveSearchBoxButton: true
                    });

                    new System.jqGridLoadSearchSaved({
                        mainGridTableId: tableName,
                        mainGridSearchOptions: searchOptions,
                        loadSearchBoxButton: true
                    });
                }

                var colNames = [
                    'npi',
                    'year',
                    'place_of_service',
                    'hcpcs_code',
                    'ShortDescription',
                    'Description',
                    'DrugIndicator',
                    'line_srvc_cnt',
                    'bene_unique_cnt',
                    'bene_day_srvc_cnt',
                    'average_medicare_allowed_amt',
                    'stdev_medicare_allowed_amt',
                    'average_submitted_chrg_amt',
                    'stdev_submitted_chrg_amt',
                    'average_medicare_payment_amt',
                    'stdev_medicare_payment_amt',
                    'average_medicare_standard_amt'
                    , 'Entity Type Code'
	                , 'Provider Organization Name (Legal Business Name)'
	                , 'Provider Last Name (Legal Name)'
	                , 'Provider First Name'
	                , 'Provider Middle Name'
	                , 'Provider Name Prefix Text'
	                , 'Provider Name Suffix Text'
	                , 'Provider Credential Text'
	                , 'Provider First Line Business Mailing Address'
	                , 'Provider Second Line Business Mailing Address'
	                , 'Provider Business Mailing Address City Name'
	                , 'Provider Business Mailing Address State Name'
	                , 'Provider Business Mailing Address Postal Code'
	                , 'Provider Business Mailing Address Country Code (If outside US)'
	                , 'Provider Business Mailing Address Telephone Number'
	                , 'Provider Business Mailing Address Fax Number'
	                , 'Provider First Line Business Practice Location Address'
	                , 'Provider Second Line Business Practice Location Address'
	                , 'Provider Business Practice Location Address City Name'
	                , 'Provider Business Practice Location Address State Name'
	                , 'Provider Business Practice Location Address Postal Code'
	                , 'Provider Business Practice Location Address Country Code (If outside US)'
	                , 'Provider Business Practice Location Address Telephone Number'
	                , 'Provider Business Practice Location Address Fax Number'
	                , 'Primary specialty'
	                , 'All secondary specialties'
                ];

                var colModel = [
                    { name: 'npi', width: 70, key: true, fixed: true, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'year', width: 35, fixed: true, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'place_of_service', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'hcpcs_code', width: 30, search: true, searchoptions: { searchhidden: true }, editable: false, formatter: hcpcsCodeFormatter },
                    { name: 'ShortDescription', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Description', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'DrugIndicator', width: 35, fixed: true, align: 'center', search: true, searchoptions: { searchhidden: true }, editable: false },
                    { name: 'line_srvc_cnt', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'bene_unique_cnt', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'bene_day_srvc_cnt', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'average_medicare_allowed_amt', formatter: 'currency', formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ " }, width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'stdev_medicare_allowed_amt', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'average_submitted_chrg_amt', formatter: 'currency', formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ " }, width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'stdev_submitted_chrg_amt', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'average_medicare_payment_amt', formatter: 'currency', formatoptions: { decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ " }, width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                    { name: 'stdev_medicare_payment_amt', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'average_medicare_standard_amt', width: 10, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, hidden: true },
                    { name: 'Entity_Type_Code', width: 5, search: true, stype: "select", searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'nu', 'nn'], value: ':;2:Organization;1:Individual' }, editable: false, hidden: true },
                    { name: 'Provider_Organization_Name__Legal_Business_Name_', width: 70, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Last_Name__Legal_Name_', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_First_Name', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Middle_Name', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Name_Prefix_Text', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Name_Suffix_Text', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Credential_Text', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_First_Line_Business_Mailing_Address', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Second_Line_Business_Mailing_Address', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Mailing_Address_City_Name', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Mailing_Address_State_Name', width: 15, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Mailing_Address_Postal_Code', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Mailing_Address_Country_Code__If_outside_US_', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Mailing_Address_Telephone_Number', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Mailing_Address_Fax_Number', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_First_Line_Business_Practice_Location_Address', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Second_Line_Business_Practice_Location_Address', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Practice_Location_Address_City_Name', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Practice_Location_Address_State_Name', width: 15, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Practice_Location_Address_Postal_Code', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Practice_Location_Address_Country_Code__If_outside_US_', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Practice_Location_Address_Telephone_Number', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Provider_Business_Practice_Location_Address_Fax_Number', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'Primary_specialty', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                    { name: 'All_secondary_specialties', width: 20, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true }
                ];

                $.each(options.colModel, function (index, specifiedValue) {
                    for (var i = 0; i < colModel.length; i++) {
                        var originalValue = colModel[i];

                        if (specifiedValue.name === originalValue.name) {
                            $.extend(originalValue, specifiedValue);
                        }
                    }
                });

                $table.jqGrid({
                    caption: $caption,
                    url: $table.data('url'),
                    datatype: "json",
                    prmNames: { id: "npi" },
                    colNames: colNames,
                    colModel: colModel,
                    rowNum: 10,
                    rowList: [10, 20, 30, 50, 75, 100, 200, 500, 1000],
                    pager: pagerName,
                    sortname: 'hcpcs_code',
                    viewrecords: true,
                    sortorder: "asc",
                    autowidth: true,
                    height: 'auto',
                    mtype: 'POST',
                    jsonReader: {
                        root: "rows",
                        page: "page",
                        total: "total",
                        records: "records",
                        repeatitems: false,
                        userdata: "userdata"
                    },
                    beforeRequest: function () {
                        // clear the old data
                        $table.jqGrid('clearGridData');
                    },
                    gridComplete: function () {
                        // resize the grid when window's resize event triggers
                        $.jgrid.resizeOnWindowResizeEvent($(this));

                        var baseUrl = $table.data('url');

                        scope.$watch("provider", function () {
                            if (!scope.provider) { return; }

                            if (scope.provider.NPI <= 0) { return; }

                            if (!baseUrl.endsWith('/0')) { return; }

                            $table.jqGrid('setGridParam', {
                                url: baseUrl.substring(0, baseUrl.length - 1) + scope.provider.NPI,
                                page: 1
                            }).trigger("reloadGrid");
                        });
                    }
                }).jqGrid('navGrid', pagerName,
                    { search: true, view: true, del: false, add: false, edit: false },
                    {}, // default settings for edit
                    {}, // default settings for add
                    {}, // delete instead that del:false we need this
                    searchOptions, // search options
                    { width: 'auto' } /* view parameters*/
                ).jqGrid('navButtonAdd', pagerName, System.jqGridDefaultColumnChooserOptions)
                .jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: 'cn' });

                $table.jqGrid('navButtonAdd', pagerName, {
                    caption: "",
                    title: "Export to a CSV file",
                    buttonicon: "ui-icon-disk",
                    onClickButton: function () {
                        System.directPOST($table.getGridParam('url'),
                            $.extend({ save: true }, $table.getGridParam("postData")));
                    },
                    position: "last"
                });

                // create the searching dialog
                if (options.showSearchDialog) {
                    $table.jqGrid('searchGrid', searchOptions);
                }

                function hcpcsCodeFormatter(cellvalue, options, rowObject) {
                    var result = [];

                    result.push(cellvalue);

                    if (rowObject.Description) {
                        result.push(' - ');
                        result.push(rowObject.Description);
                    }

                    return result.join('');
                };
            }
        };
    }])
    .directive('medicareProviderGroupPracticeMembers', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var tableName = "#medicare-provider-group-practice-members-" + System.nextUniqueID();
                var pagerName = tableName + '-pager';
                var options = scope.$eval(attr.medicareProviderGroupPracticeMembers);
                var $table = $(element);

                $table.attr('ID', tableName.substring(1));

                // create the pager element
                $('<div/>').attr('ID', pagerName.substring(1)).insertAfter($table);

                // initialize default options
                if (typeof options === 'undefined') { options = {}; }

                options.caption = '<i class="fa fa-users"></i>&nbsp;'
                    + (typeof (options.caption) !== 'undefined'
                    ? options.caption : 'Group Practice Members');

                $table.jqGrid($.extend({
                    url: $table.data('url'),
                    datatype: "json",
                    prmNames: { id: "npi" },
                    colNames: [
                        'NPI'
                        , 'Contact ID'
                        , 'Prefix'
                        , 'First Name'
                        , 'Middle Name'
                        , 'Last Name'
                        , 'Suffix'
                        , 'Credential'
                        , 'Gender'
                        , 'PAC ID'
                        , 'Professional Enrollment ID'
                        , 'Phone Number'
                        , 'Provider Business Mailing Address Telephone Number'
                        , 'Provider Business Practice Location Address Telephone Number'
                        , 'Medical school name'
                        , 'Graduation year'
                        , 'Primary specialty'
                        , 'Secondary specialty 1'
                        , 'Secondary specialty 2'
                        , 'Secondary specialty 3'
                        , 'Secondary specialty 4'
                        , 'All secondary specialties'
                    ],
                    colModel: [
                        { name: 'NPI', width: 70, key: true, fixed: true, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false, formatter: System.medicareProviderIdFormatter },
                        { name: 'ContactID', width: 50, fixed: true, search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn'] }, editable: false, hidden: true, formatter: System.medicareProviderIdFormatter },
                        { name: 'Provider_Name_Prefix_Text', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                        { name: 'Provider_First_Name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                        { name: 'Provider_Middle_Name', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false },
                        { name: 'Provider_Last_Name__Legal_Name_', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                        { name: 'Provider_Name_Suffix_Text', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                        { name: 'Provider_Credential_Text', width: 25, search: true, searchoptions: { searchhidden: true }, editable: false },
                        { name: 'Provider_Gender_Code', width: 10, search: true, searchoptions: { searchhidden: true }, editable: false },
                        { name: 'PAC_ID', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                        { name: 'Professional_Enrollment_ID', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                        { name: 'Phone_Number', width: 30, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: false },
                        { name: 'Provider_Business_Mailing_Address_Telephone_Number', width: 30, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                        { name: 'Provider_Business_Practice_Location_Address_Telephone_Number', width: 30, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                        { name: 'Medical_school_name', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                        { name: 'Graduation_year', width: 15, align: 'right', search: true, searchtype: 'integer', searchoptions: { searchhidden: true, sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'] }, editable: false },
                        { name: 'Primary_specialty', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false },
                        { name: 'Secondary_specialty_1', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                        { name: 'Secondary_specialty_2', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                        { name: 'Secondary_specialty_3', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                        { name: 'Secondary_specialty_4', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false, hidden: true },
                        { name: 'All_secondary_specialties', width: 50, search: true, searchoptions: { searchhidden: true }, editable: false }
                    ],
                    rowNum: 100,
                    rowList: [10, 20, 30, 50, 75, 100, 200, 500, 1000],
                    pager: pagerName,
                    sortname: 'Provider_Last_Name__Legal_Name_',
                    viewrecords: true,
                    sortorder: "asc",
                    autowidth: true,
                    height: 'auto',
                    mtype: 'POST',
                    jsonReader: {
                        root: "rows",
                        page: "page",
                        total: "total",
                        records: "records",
                        repeatitems: false,
                        userdata: "userdata"
                    },
                    beforeRequest: function () {
                        // clear the old data
                        $table.jqGrid('clearGridData');
                    },
                    gridComplete: function () {
                        // resize the grid when window's resize event triggers
                        $.jgrid.resizeOnWindowResizeEvent($(this));

                        var baseUrl = $table.data('url');

                        scope.$watch("provider", function () {
                            if (!scope.provider) { return; }

                            if (scope.provider.NPI <= 0) { return; }

                            if (!baseUrl.endsWith('/0')) { return; }

                            $table.jqGrid('setGridParam', {
                                url: baseUrl.substring(0, baseUrl.length - 1) + scope.provider.NPI,
                                page: 1
                            }).trigger("reloadGrid");
                        });
                    }
                }, options)).jqGrid('navGrid', pagerName,
                    { search: true, view: true, del: false, add: false, edit: false },
                    {}, // default settings for edit
                    {}, // default settings for add
                    {}, // delete instead that del:false we need this
                    {
                        multipleSearch: true,
                        multipleGroup: true,
                        recreateFilter: true,
                        showQuery: true,
                        overlay: false,
                        drag: false,
                        resize: false,
                        afterShowSearch: function () {
                            $.jgrid.placeSearchDialogAboveGrid({
                                tableid: tableName,
                                searchOnEnter: true,
                            });
                        }
                    }, // search options
                    { width: 'auto' } /* view parameters*/
                ).jqGrid('navButtonAdd', pagerName, System.jqGridDefaultColumnChooserOptions)
                .jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: 'cn' });

                $table.jqGrid('navButtonAdd', pagerName, {
                    caption: "",
                    title: "Export to a CSV file",
                    buttonicon: "ui-icon-disk",
                    onClickButton: function () {
                        System.directPOST($table.getGridParam('url'),
                            $.extend({ save: true }, $table.getGridParam("postData")));
                    },
                    position: "last"
                });
            }
        };
    }]);

    System.medicareProviderIdFormatter = function (cellvalue, options, rowObject) {
        if (rowObject.ContactID != null && $.isFunction(System.getAccountDetailLink)) {
            return System.getAccountDetailLink(rowObject.ContactID, cellvalue);
        } else if (rowObject.InstitutionID != null && $.isFunction(System.getInstitutionDetailLink)) {
            return System.getInstitutionDetailLink(rowObject.InstitutionID, cellvalue);
        }

        if (cellvalue) {
            return cellvalue;
        }

        return '';
    }
}());