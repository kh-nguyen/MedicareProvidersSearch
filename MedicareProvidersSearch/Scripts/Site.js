var DATASERVICE_ROOT_PATH = '/Data/';

var System;

if (!System) {
    System = {
        jqGridCountryList: '', // jqGrid countries string
        CountryDictionary: {},
        CountriesData: []
    };

    //----------------------------------------------------------------
    // Overwrite default options of jqGrid
    if (typeof $.jgrid !== "undefined") {
        $.extend($.jgrid.del, {
            beforeShowForm: function ($form) {
                positionForm($form);
            }
        });

        $.extend($.jgrid.add, {
            closeOnEscape: true,
            closeAfterAdd: true,
            beforeShowForm: function ($form) {
                hookNavigationButtonsToKeys($form);
                positionForm($form);
            }
        });

        $.extend($.jgrid.edit, {
            closeOnEscape: true,
            closeAfterEdit: true,
            afterShowForm: function ($form) {
                hookNavigationButtonsToKeys($form);
                positionForm($form);
            }
        });

        $.extend($.jgrid.view, {
            recreateForm: true,
            beforeShowForm: function ($form) {
                $form.find("td.DataTD").each(function () {
                    var $this = $(this);

                    $this.children("span").css({
                        overflow: "auto",
                        "text-align": "inherit",
                        display: "inline-block",
                        "max-height": "600px"
                    });
                });

                hookNavigationButtonsToKeys($form);
                positionForm($form, 894);
            }
        });

        // add an extended function to jqgrid object
        $.extend($.jgrid, {
            placeSearchDialogAboveGrid: function (parameters) {
                var gridSelector = $.jgrid.jqID($(parameters.tableid)[0].id), // 'list'
                    $searchDialog = $("#searchmodfbox_" + gridSelector),
                    $gbox = $("#gbox_" + gridSelector),
                    $gview = $("#gview_" + gridSelector);
                var displaySearchDialogCloseButton = typeof (parameters.displaySearchDialogCloseButton)
                    !== 'undefined' ? parameters.displaySearchDialogCloseButton : false;

                if (!displaySearchDialogCloseButton) {
                    // hide 'close' button of the searching dialog
                    $searchDialog.find("a.ui-jqdialog-titlebar-close").hide();
                }

                // place the searching dialog above the grid
                $searchDialog.insertBefore($gbox);
                $searchDialog.css({
                    width: "100%",
                    "font-size": $gview.css("font-size"),
                    position: "relative",
                    zIndex: "auto",
                    cssFloat: "left"
                });
                $gbox.css({ clear: "left" });

                // search on enter
                if (parameters.searchOnEnter === true) {
                    $searchDialog.keypress(function (event) {
                        if (event.which === 13) {
                            $(this).focus();
                            $("#fbox_" + gridSelector + "_search").click();
                        }
                    });
                }

                return {
                    gridSelector: gridSelector,
                    gbox: $gbox,
                    searchDialog: $searchDialog
                };
            },
            resizeOnWindowResizeEvent: function ($grid) {
                // resize the grid when window's resize event triggers
                $(window).resize(function () {
                    // Note: checking the $grid only may not be enough
                    // to determine whether we should do the resize or not
                    // because the $grid is wrapped inside a #gbox div tag.
                    // So, it is best to check the $gbox to do the resize.
                    // skip if the grid is not visible on the screen

                    var gridSelector = $.jgrid.jqID($grid[0].id),
                        $gbox = $("#gbox_" + gridSelector);

                    if ($gbox.is(':visible')) {
                        var new_width = $gbox.parent().width();

                        if ($grid.data('resize-width') != new_width) {
                            $grid.jqGrid('setGridWidth', new_width);
                            // remember the width so that it will not
                            // request the resize change again if the
                            // width has not been changed
                            $grid.data('resize-width', new_width);
                        }
                    }
                });
            }
        });

        function positionForm(formid, minWidth) {
            setTimeout(function () {
                var $dialog = $(formid).closest('div.ui-jqdialog');

                if (typeof (minWidth) !== "undefined") {
                    $dialog.css({
                        "min-width": minWidth
                    });
                }

                $dialog
                .position({
                    my: "top",
                    at: "top",
                    of: window
                });
            }, 0);
        }

        // hook up the navigation buttons to the keys
        function hookNavigationButtonsToKeys($form) {
            setTimeout(function () {
                var $dialog = $form.closest('div.ui-jqdialog');
                var prevButton = $dialog.find("#pData");
                var nextButton = $dialog.find("#nData");

                // hook up the previous button to the left key
                $dialog.keypress(function (event) {
                    if (event.keyCode == 37) { // left
                        prevButton.click();
                    }
                });

                // hook up the next button to the right key
                $dialog.keypress(function (event) {
                    if (event.keyCode == 39) { // right
                        nextButton.click();
                    }
                });
            }, 0);
        }
    }
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    // Define global AngularJS custom directives
    if (typeof (angular) !== 'undefined') {
        System.angular = angular.module('app', ['ng'])
        .directive('stopEvent', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    element.bind(attr.stopEvent, function (e) {
                        e.stopPropagation();
                    });
                }
            };
        })
        .directive('submitOnChange', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    var $element = $(element);
                    $element.change(function (eventObject) {
                        $element.closest("form").submit();
                    });
                }
            };
        })
        .directive('dynamicUnobtrusiveValidator', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    var $form = element.closest('form');
                    $.validator.unobtrusive.parseDynamicContent($form);
                }
            };
        })
        .directive('jqDialog', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    var options = scope.$eval(attributes.jqDialog);

                    $(element).click(function (event) {
                        /* stop form from submitting normally */
                        event.preventDefault();

                        System.loadDialogWindow($.extend({ link: $(element) }, options));
                    });
                }
            };
        })
        .directive('accordion', ['$compile', '$timeout', function ($compile, $timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    var options = scope.$eval(attributes.accordion);

                    // turn element into accordions
                    $(element).accordion($.extend(options, {
                        beforeActivate: function (event, ui) {
                            var panel = ui.newPanel;
                            var url = panel.data('url');

                            if (panel.html() === '' && typeof url !== 'undefined') {
                                var panelType = panel.data('type');

                                if (panelType === 'iframe') {
                                    panel.append('<iframe seamless src="' + url + '" />');
                                }
                                else {
                                    panel.load(url, function () {
                                        $timeout(function () {
                                            $compile($(panel).contents())(scope);
                                        });
                                    });
                                }
                            }
                        },
                        activate: function (event, ui) {
                            // help to correct the size of the elements
                            $(window).trigger('resize');
                        }
                    }));
                }
            };
        }])
        .directive('tableToGrid', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    var options = scope.$eval(attributes.tableToGrid);

                    // give it a unique id because tableToGrid needs it to make references latter.
                    $(element).attr('id', "tableToGrid-" + System.nextUniqueID());

                    // extract the caption of the table
                    $(element).find('caption').each(function () {
                        $.extend(options, { caption: $(this).text() });
                    });

                    // turn table into grid
                    tableToGrid(element, options);
                }
            };
        })
        .directive('datePicker', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    System.getJqGridDefaultDatePicker($(element));
                }
            };
        })
        .directive('dateTimePicker', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    System.getJqGridDefaultDateTimePicker($(element));
                }
            };
        })
        .directive('jqgridStayTop', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    var options = scope.$eval(attributes.jqgridStayTop);
                    var $grid = $(element);

                    $(document).scroll(function () {
                        // if the grid is not available yet, exit the function
                        if ($grid.is(':hidden') || typeof $grid[0].grid === 'undefined') {
                            return;
                        }

                        var $hdiv = $($grid[0].grid.hDiv),
                            $cdiv = $($grid[0].grid.cDiv);
                        var cssReset = { position: "", zIndex: "", top: "", left: "" };
                        var topDiv = $hdiv;
                        var $searchOptions = $('#fbox_' + element[0].id + '_2');

                        // handle case where the grid has caption
                        if ($cdiv.is(':visible')) {
                            topDiv = $cdiv;

                            // reset to the original position
                            topDiv.css(cssReset);
                        }

                        var hiddenClass = "hidden-md hidden-sm hidden-xs";

                        // reset to the original position
                        $hdiv.css(cssReset);
                        $searchOptions.css(cssReset).css({
                            width: "",
                            "background-color": "",
                            "margin-top": "5px",
                            "margin-left": "",
                            "border-bottom": ""
                        }).removeClass(hiddenClass);

                        // get the offset of the top div at the original position
                        var top = topDiv.offset().top;

                        // make it stay on top if the top div is over the top
                        if (top < $(document).scrollTop()) {
                            var $width = $hdiv.width();

                            topDiv.css({ position: "fixed", zIndex: 1, top: 0 });

                            // make header fixed
                            if (topDiv !== $hdiv) {
                                // caption needs to set the original width
                                topDiv.css({ width: $width });

                                $hdiv.css({ position: "fixed", zIndex: 1, top: topDiv.outerHeight(true) });
                            }

                            if ($(element).data('searchBoxStayTop')) {
                                // make the search options to be on top, at the bottom of the hDiv
                                $searchOptions.css({
                                    position: "fixed",
                                    zIndex: 1,
                                    top: $hdiv.outerHeight(true) + $hdiv.position().top,
                                    width: $hdiv.outerWidth(true),
                                    "background-color": "White",
                                    "margin-top": 0,
                                    "margin-left": "-5px",
                                    "border-bottom": "1px solid lightgray"
                                }).addClass(hiddenClass);
                            }
                        }
                    });
                }
            };
        })
        .directive('hcpcsCodeSelect', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    var $select = $(element);

                    // add the auto-complete for the subject
                    $select.autocomplete({
                        source: DATASERVICE_ROOT_PATH + 'SearchHCPCSCodes',
                        minLength: 2,
                        select: function (event, ui) {
                            this.value = ui.item.HCPCS;
                            return false;
                        },
                        focus: function (event, ui) {
                            this.value = ui.item.HCPCS;
                            return false;
                        }
                    }).autocomplete("instance")._renderItem = function (ul, item) {
                        return $("<li/>")
                        .append($("<a/>").text(item.HCPCS + " - "
                            + (item.Description === null
                            ? item.ShortDescription : item.Description)))
                        .appendTo(ul);
                    };

                    // display the information of the current code
                    $select.click(function () {
                        $(this).autocomplete("search", this.value);
                    })
                }
            };
        });

        // html filter (render text as html)
        System.angular.filter('html', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }]);

        System.angular.service('CountriesService', function () {
            this.get = function () {
                if (System.CountriesData.length === 0) {
                    System.getJqGridCountryList();
                }

                return System.CountriesData;
            };

            this.toCountryName = function (TLD) {
                var countryDictionary = System.getCountryDictionary();
                return countryDictionary[TLD];
            };
        });
    }
    //----------------------------------------------------------------

    // functions to add/remove/get data from LocalStorage
    System.saveObjectInLocalStorage = function (storageItemName, object) {
        if (typeof window.localStorage !== 'undefined') {
            window.localStorage.setItem(storageItemName, JSON.stringify(object));
        }
    };
    System.removeObjectFromLocalStorage = function (storageItemName) {
        if (typeof window.localStorage !== 'undefined') {
            window.localStorage.removeItem(storageItemName);
        }
    };
    System.getObjectFromLocalStorage = function (storageItemName) {
        if (typeof window.localStorage !== 'undefined') {
            return JSON.parse(window.localStorage.getItem(storageItemName));
        }
    };

    System.jqGridSearchHistories = function (parameters) {
        var $self = this;
        var $searchHistoriesTableName = parameters.mainGridTableId + '-search-histories';
        var $savedSearchesTableName = parameters.mainGridTableId + '-saved-searches';
        var $table = $($searchHistoriesTableName);

        // if there is no search table then exit
        if ($table.length === 0) { return; }

        var $mainTable = $(parameters.mainGridTableId);
        var fid = parameters.mainGridTableId.substring(1);
        var loadSearchBoxButtonClass = $searchHistoriesTableName.substring(1) + '-loadsearchbox';
        var saveSearchBoxButtonClass = $searchHistoriesTableName.substring(1) + '-savesearchbox';
        $self.SearchHistoriesStorageItemName = $searchHistoriesTableName;
        $self.SearchHistoriesStorage = System.getObjectFromLocalStorage($self.SearchHistoriesStorageItemName);

        $table.jqGrid({
            caption: "<i class='fa fa-history'></i>&nbsp;Local Search Histories",
            data: this.SearchHistoriesStorage ? this.SearchHistoriesStorage : [],
            datatype: "local",
            colNames: ['Time', 'Search', 'Filter', 'Options'],
            colModel: [
                {
                    name: 'Time', width: 100, fixed: true, search: false, sortable: true, key: true, formatter: 'date',
                    formatoptions: { srcformat: 'Y-m-d\\TH:i:s', newformat: 'Y-m-d H:i:s' }
                },
                { name: 'Search', width: 30, maxlength: 100, sortable: false, search: true },
                { name: 'Filter', hidden: true, viewable: true, sortable: false, search: true, searchoptions: { searchhidden: true } },
                { name: 'Options', width: 10, search: false, sortable: false, align: "center", formatter: displayLoadButton }
            ],
            rowNum: 10,
            rowList: [10, 20, 30, 50, 75, 100, 200, 500, 1000],
            viewrecords: true,
            pager: $searchHistoriesTableName + '-pager',
            scroll: true,
            scrollrows: true,
            multiselect: false,
            autowidth: true,
            gridview: false, // required for afterInsertRow event
            pginput: false,
            sortname: 'Time',
            sortorder: "desc",
            height: 100,
            afterInsertRow: function (rowid, rowdata, rowelem) {
                var htmlRow = $($table.jqGrid('getInd', rowid, true));

                if (parameters.loadSearchBoxButton === true) {
                    htmlRow.find('.' + loadSearchBoxButtonClass).click(function () {
                        $("#fbox_" + fid).jqFilter('addFilter', rowdata.Filter);
                        $mainTable.jqGrid('setGridParam', {
                            search: true, postData: { filters: rowdata.Filter }
                        }).trigger("reloadGrid");
                        $(window).scrollTop($('#searchmodfbox_' + fid).position().top);
                    });
                }

                if (parameters.saveSearchBoxButton === true) {
                    htmlRow.find('.' + saveSearchBoxButtonClass).click(function () {
                        var $dialog = System.loadDialogWindow({
                            link: $('<a href="/Account/ListAddSavedSearch"></a>'),
                            title: "Bookmark the saved search",
                            complete: function () {
                                $('#SearchType', $dialog).val(parameters.mainGridTableId.substring(1));
                                $('#Search', $dialog).val(rowdata.Search);
                                $('#Filter', $dialog).val(rowdata.Filter);

                                $dialog.bind("reloadGrid", function (event, ui) {
                                    $($savedSearchesTableName).trigger("reloadGrid");
                                });
                            }
                        });
                    });
                }
            },
            gridComplete: function () {
                // hide the pager
                $($searchHistoriesTableName + '-pager_center').css("cssText", "width: 0 !important");

                // resize the grid when window's resize event triggers
                $.jgrid.resizeOnWindowResizeEvent($(this));
            }
        }).jqGrid('navGrid', $searchHistoriesTableName + '-pager',
            { search: true, view: true, del: true, add: false, edit: false, refresh: false },
            {}, // default settings for edit
            {}, // default settings for add
            {
                // because I use "local" data I don't want to send the changes
                // to the server so I use "processing:true" setting and delete
                // the row manually in onclickSubmit
                onclickSubmit: function (options) {
                    var grid_id = $.jgrid.jqID($table[0].id),
                        grid_p = $table[0].p,
                        newPage = grid_p.page,
                        rowids = grid_p.multiselect ? grid_p.selarrrow : [grid_p.selrow];

                    // reset the value of processing option which could be modified
                    options.processing = true;

                    // delete the row
                    $.each(rowids, function () {
                        $table.delRowData(this);
                    });
                    $.jgrid.hideModal("#delmod" + grid_id, {
                        gb: "#gbox_" + grid_id,
                        jqm: options.jqModal, onClose: options.onClose
                    });

                    if (grid_p.lastpage > 1) {// on the multi-page grid reload the grid
                        if (grid_p.reccount === 0 && newPage === grid_p.lastpage) {
                            // if after deleting there are no rows on the current page
                            // which is the last page of the grid
                            newPage--; // go to the previous page
                        }
                        // reload grid to make the row from the next page visible.
                        $table.trigger("reloadGrid", [{ page: newPage }]);
                    }

                    // reconstruct the storage
                    $self.SearchHistoriesStorage = [];
                    var rows = $table.getDataIDs();
                    for (var i = 0; i < rows.length; i++) {
                        var row = $table.getRowData(rows[i]);

                        $self.SearchHistoriesStorage.push({
                            Time: row.Time,
                            Search: row.Search,
                            Filter: row.Filter,
                        });
                    }
                    System.saveObjectInLocalStorage(
                        $self.SearchHistoriesStorageItemName,
                        $self.SearchHistoriesStorage);

                    return true;
                },
                processing: true
            }, // delete options
            {}, // search options
            {} /* view parameters*/
        )
        .jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: 'cn' })
        .jqGrid('navButtonAdd', $searchHistoriesTableName + '-pager', {
            caption: "",
            title: "Clear the whole list",
            buttonicon: "fa fa-eraser",
            onClickButton: function () {
                System.removeObjectFromLocalStorage(
                    $self.SearchHistoriesStorageItemName);

                $self.SearchHistoriesStorage = [];

                $table.jqGrid('clearGridData');
            },
            position: "first"
        });

        // hook up the search button event
        if (typeof parameters.mainGridSearchOptions !== "undefined") {
            var oldOnSearchFunction = parameters.mainGridSearchOptions.onSearch;

            $.extend(parameters.mainGridSearchOptions, {
                onSearch: function () {
                    var postData = $mainTable.jqGrid('getGridParam', 'postData');

                    if (postData.filters.length > 0) {
                        $self.addSearchItem($('#fbox_' + parameters.mainGridTableId
                            .replace('#', '') + ' .query').text(), postData.filters);
                    }

                    // call the original onSearch function if defined
                    if (typeof oldOnSearchFunction !== "undefined") {
                        oldOnSearchFunction();
                    }
                }
            });
        }

        function displayLoadButton(cellvalue, options, rowObject) {
            var result = [];

            result.push('<ul>');
            if (parameters.loadSearchBoxButton === true) {
                result.push('<li class="' + loadSearchBoxButtonClass + ' ui-state-default ui-corner-all" ');
                result.push('style="margin:2px;position:relative;padding:0;cursor:pointer;float:left;list-style:none;">');
                result.push('<span class="ui-icon ui-icon-search" title="Search using this filter"></span></li>');
            }
            if (parameters.saveSearchBoxButton === true) {
                result.push('<li class="' + saveSearchBoxButtonClass + ' ui-state-default ui-corner-all" ');
                result.push('style="margin:2px;position:relative;padding:0;cursor:pointer;float:left;list-style:none;">');
                result.push('<span class="ui-icon ui-icon-pin-w" title="Save the filter"></span></li>');
            }
            result.push('</ul>');

            return result.join('');
        }

        this.addSearchItem = function (searchName, searchValue) {
            // use the searchValue as searchName if there is no such value
            if ($.trim(searchName).length === 0) {
                searchName = searchValue;
            }

            if (!$self.SearchHistoriesStorage) {
                $self.SearchHistoriesStorage = [];
            }

            $self.SearchHistoriesStorage.push({
                Time: new Date(),
                Search: searchName,
                Filter: searchValue
            });

            System.saveObjectInLocalStorage(
                $self.SearchHistoriesStorageItemName,
                $self.SearchHistoriesStorage);

            $table.jqGrid('setGridParam', {
                data: $self.SearchHistoriesStorage
            }).trigger("reloadGrid");
        };

        this.getGridTable = function () {
            return $table;
        };
    };

    System.getCountryDictionary = function () {
        if (jQuery.isEmptyObject(System.CountryDictionary)) {
            System.getJqGridCountryList();
        }

        return System.CountryDictionary;
    };

    System.getJqGridCountryList = function () {
        if (System.jqGridCountryList.length === 0) {
            System.CountriesData = [{ "TLD": "AF", "CountryName": "Afghanistan" }, { "TLD": "AL", "CountryName": "Albania" }, { "TLD": "DZ", "CountryName": "Algeria" }, { "TLD": "AS", "CountryName": "American Samoa" }, { "TLD": "AD", "CountryName": "Andorra" }, { "TLD": "AO", "CountryName": "Angola" }, { "TLD": "AI", "CountryName": "Anguilla" }, { "TLD": "AQ", "CountryName": "Antarctica" }, { "TLD": "AG", "CountryName": "Antigua and Barbuda" }, { "TLD": "AR", "CountryName": "Argentina" }, { "TLD": "AM", "CountryName": "Armenia" }, { "TLD": "AW", "CountryName": "Aruba" }, { "TLD": "AU", "CountryName": "Australia" }, { "TLD": "AT", "CountryName": "Austria" }, { "TLD": "AZ", "CountryName": "Azerbaijan" }, { "TLD": "BS", "CountryName": "Bahamas" }, { "TLD": "BH", "CountryName": "Bahrain" }, { "TLD": "BD", "CountryName": "Bangladesh" }, { "TLD": "BB", "CountryName": "Barbados" }, { "TLD": "BY", "CountryName": "Belarus" }, { "TLD": "BE", "CountryName": "Belgium" }, { "TLD": "BZ", "CountryName": "Belize" }, { "TLD": "BJ", "CountryName": "Benin" }, { "TLD": "BM", "CountryName": "Bermuda" }, { "TLD": "BT", "CountryName": "Bhutan" }, { "TLD": "BO", "CountryName": "Bolivia" }, { "TLD": "BA", "CountryName": "Bosnia and Herzegovina" }, { "TLD": "BW", "CountryName": "Botswana" }, { "TLD": "BV", "CountryName": "Bouvet Island" }, { "TLD": "BR", "CountryName": "Brazil" }, { "TLD": "IO", "CountryName": "British Indian Ocean Territory" }, { "TLD": "VG", "CountryName": "British Virgin Islands" }, { "TLD": "BN", "CountryName": "Brunei Darussalam" }, { "TLD": "BG", "CountryName": "Bulgaria" }, { "TLD": "BF", "CountryName": "Burkina Faso" }, { "TLD": "MM", "CountryName": "Burma" }, { "TLD": "BI", "CountryName": "Burundi" }, { "TLD": "KH", "CountryName": "Cambodia" }, { "TLD": "CM", "CountryName": "Cameroon" }, { "TLD": "CA", "CountryName": "Canada" }, { "TLD": "CV", "CountryName": "Cape Verde" }, { "TLD": "KY", "CountryName": "Cayman Islands" }, { "TLD": "CF", "CountryName": "Central African Republic" }, { "TLD": "TD", "CountryName": "Chad" }, { "TLD": "CL", "CountryName": "Chile" }, { "TLD": "CN", "CountryName": "China" }, { "TLD": "CX", "CountryName": "Christmas Island" }, { "TLD": "CC", "CountryName": "Cocos (Keeling) Islands" }, { "TLD": "CO", "CountryName": "Colombia" }, { "TLD": "KM", "CountryName": "Comoros" }, { "TLD": "CD", "CountryName": "Congo, Democratic Republic of the" }, { "TLD": "CG", "CountryName": "Congo, Republic of the" }, { "TLD": "CK", "CountryName": "Cook Islands" }, { "TLD": "CR", "CountryName": "Costa Rica" }, { "TLD": "CI", "CountryName": "Cote d'Ivoire" }, { "TLD": "HR", "CountryName": "Croatia" }, { "TLD": "CU", "CountryName": "Cuba" }, { "TLD": "CY", "CountryName": "Cyprus" }, { "TLD": "CZ", "CountryName": "Czech Republic" }, { "TLD": "DK", "CountryName": "Denmark" }, { "TLD": "DJ", "CountryName": "Djibouti" }, { "TLD": "DM", "CountryName": "Dominica" }, { "TLD": "DO", "CountryName": "Dominican Republic" }, { "TLD": "TP", "CountryName": "East Timor" }, { "TLD": "EC", "CountryName": "Ecuador" }, { "TLD": "EG", "CountryName": "Egypt" }, { "TLD": "SV", "CountryName": "El Salvador" }, { "TLD": "GQ", "CountryName": "Equatorial Guinea" }, { "TLD": "ER", "CountryName": "Eritrea" }, { "TLD": "EE", "CountryName": "Estonia" }, { "TLD": "ET", "CountryName": "Ethiopia" }, { "TLD": "FK", "CountryName": "Falkland Islands (Islas Malvinas)" }, { "TLD": "FO", "CountryName": "Faroe Islands" }, { "TLD": "FJ", "CountryName": "Fiji" }, { "TLD": "FI", "CountryName": "Finland" }, { "TLD": "FR", "CountryName": "France" }, { "TLD": "FX", "CountryName": "France, Metropolitan" }, { "TLD": "GF", "CountryName": "French Guiana" }, { "TLD": "PF", "CountryName": "French Polynesia" }, { "TLD": "TF", "CountryName": "French Southern and Antarctic Lands" }, { "TLD": "GA", "CountryName": "Gabon" }, { "TLD": "GE", "CountryName": "Georgia" }, { "TLD": "DE", "CountryName": "Germany" }, { "TLD": "GH", "CountryName": "Ghana" }, { "TLD": "GI", "CountryName": "Gibraltar" }, { "TLD": "GR", "CountryName": "Greece" }, { "TLD": "GL", "CountryName": "Greenland" }, { "TLD": "GD", "CountryName": "Grenada" }, { "TLD": "GP", "CountryName": "Guadeloupe" }, { "TLD": "GU", "CountryName": "Guam" }, { "TLD": "GT", "CountryName": "Guatemala" }, { "TLD": "GG", "CountryName": "Guernsey" }, { "TLD": "GN", "CountryName": "Guinea" }, { "TLD": "GW", "CountryName": "Guinea-Bissau" }, { "TLD": "GY", "CountryName": "Guyana" }, { "TLD": "HT", "CountryName": "Haiti" }, { "TLD": "HM", "CountryName": "Heard Island and McDonald Islands" }, { "TLD": "VA", "CountryName": "Holy See (Vatican City)" }, { "TLD": "HN", "CountryName": "Honduras" }, { "TLD": "HK", "CountryName": "Hong Kong (SAR)" }, { "TLD": "HU", "CountryName": "Hungary" }, { "TLD": "IS", "CountryName": "Iceland" }, { "TLD": "IN", "CountryName": "India" }, { "TLD": "ID", "CountryName": "Indonesia" }, { "TLD": "IR", "CountryName": "Iran" }, { "TLD": "IQ", "CountryName": "Iraq" }, { "TLD": "IE", "CountryName": "Ireland" }, { "TLD": "IL", "CountryName": "Israel" }, { "TLD": "IT", "CountryName": "Italy" }, { "TLD": "JM", "CountryName": "Jamaica" }, { "TLD": "JP", "CountryName": "Japan" }, { "TLD": "JE", "CountryName": "Jersey" }, { "TLD": "JO", "CountryName": "Jordan" }, { "TLD": "KZ", "CountryName": "Kazakhstan" }, { "TLD": "KE", "CountryName": "Kenya" }, { "TLD": "KI", "CountryName": "Kiribati" }, { "TLD": "KP", "CountryName": "Korea, North" }, { "TLD": "KR", "CountryName": "Korea, Republic of" }, { "TLD": "KW", "CountryName": "Kuwait" }, { "TLD": "KG", "CountryName": "Kyrgyzstan" }, { "TLD": "LA", "CountryName": "Laos" }, { "TLD": "LV", "CountryName": "Latvia" }, { "TLD": "LB", "CountryName": "Lebanon" }, { "TLD": "LS", "CountryName": "Lesotho" }, { "TLD": "LR", "CountryName": "Liberia" }, { "TLD": "LY", "CountryName": "Libya" }, { "TLD": "LI", "CountryName": "Liechtenstein" }, { "TLD": "LT", "CountryName": "Lithuania" }, { "TLD": "LU", "CountryName": "Luxembourg" }, { "TLD": "MO", "CountryName": "Macao" }, { "TLD": "MK", "CountryName": "Macedonia, The Former Yugoslav Republic of" }, { "TLD": "MG", "CountryName": "Madagascar" }, { "TLD": "MW", "CountryName": "Malawi" }, { "TLD": "MY", "CountryName": "Malaysia" }, { "TLD": "MV", "CountryName": "Maldives" }, { "TLD": "ML", "CountryName": "Mali" }, { "TLD": "MT", "CountryName": "Malta" }, { "TLD": "IM", "CountryName": "Man, Isle of" }, { "TLD": "MH", "CountryName": "Marshall Islands" }, { "TLD": "MQ", "CountryName": "Martinique" }, { "TLD": "MR", "CountryName": "Mauritania" }, { "TLD": "MU", "CountryName": "Mauritius" }, { "TLD": "YT", "CountryName": "Mayotte" }, { "TLD": "MX", "CountryName": "Mexico" }, { "TLD": "FM", "CountryName": "Micronesia, Federated States of" }, { "TLD": "MD", "CountryName": "Moldova" }, { "TLD": "MC", "CountryName": "Monaco" }, { "TLD": "MN", "CountryName": "Mongolia" }, { "TLD": "ME", "CountryName": "Montenegro" }, { "TLD": "MS", "CountryName": "Montserrat" }, { "TLD": "MA", "CountryName": "Morocco" }, { "TLD": "MZ", "CountryName": "Mozambique" }, { "TLD": "NA", "CountryName": "Namibia" }, { "TLD": "NR", "CountryName": "Nauru" }, { "TLD": "NP", "CountryName": "Nepal" }, { "TLD": "NL", "CountryName": "Netherlands" }, { "TLD": "AN", "CountryName": "Netherlands Antilles" }, { "TLD": "NC", "CountryName": "New Caledonia" }, { "TLD": "NZ", "CountryName": "New Zealand" }, { "TLD": "NI", "CountryName": "Nicaragua" }, { "TLD": "NE", "CountryName": "Niger" }, { "TLD": "NG", "CountryName": "Nigeria" }, { "TLD": "NU", "CountryName": "Niue" }, { "TLD": "NF", "CountryName": "Norfolk Island" }, { "TLD": "MP", "CountryName": "Northern Mariana Islands" }, { "TLD": "NO", "CountryName": "Norway" }, { "TLD": "OM", "CountryName": "Oman" }, { "TLD": "PK", "CountryName": "Pakistan" }, { "TLD": "PW", "CountryName": "Palau" }, { "TLD": "PS", "CountryName": "Palestinian Territory, Occupied" }, { "TLD": "PA", "CountryName": "Panama" }, { "TLD": "PG", "CountryName": "Papua New Guinea" }, { "TLD": "PY", "CountryName": "Paraguay" }, { "TLD": "PE", "CountryName": "Peru" }, { "TLD": "PH", "CountryName": "Philippines" }, { "TLD": "PN", "CountryName": "Pitcairn Islands" }, { "TLD": "PL", "CountryName": "Poland" }, { "TLD": "PT", "CountryName": "Portugal" }, { "TLD": "PR", "CountryName": "Puerto Rico" }, { "TLD": "QA", "CountryName": "Qatar" }, { "TLD": "RE", "CountryName": "Réunion" }, { "TLD": "RO", "CountryName": "Romania" }, { "TLD": "RU", "CountryName": "Russia" }, { "TLD": "RW", "CountryName": "Rwanda" }, { "TLD": "SH", "CountryName": "Saint Helena" }, { "TLD": "KN", "CountryName": "Saint Kitts and Nevis" }, { "TLD": "LC", "CountryName": "Saint Lucia" }, { "TLD": "PM", "CountryName": "Saint Pierre and Miquelon" }, { "TLD": "VC", "CountryName": "Saint Vincent and the Grenadines" }, { "TLD": "WS", "CountryName": "Samoa" }, { "TLD": "SM", "CountryName": "San Marino" }, { "TLD": "ST", "CountryName": "São Tomé and Príncipe" }, { "TLD": "SA", "CountryName": "Saudi Arabia" }, { "TLD": "SN", "CountryName": "Senegal" }, { "TLD": "RS", "CountryName": "Serbia" }, { "TLD": "SC", "CountryName": "Seychelles" }, { "TLD": "SL", "CountryName": "Sierra Leone" }, { "TLD": "SG", "CountryName": "Singapore" }, { "TLD": "SK", "CountryName": "Slovakia" }, { "TLD": "SI", "CountryName": "Slovenia" }, { "TLD": "SB", "CountryName": "Solomon Islands" }, { "TLD": "SO", "CountryName": "Somalia" }, { "TLD": "ZA", "CountryName": "South Africa" }, { "TLD": "GS", "CountryName": "South Georgia and the South Sandwich Islands" }, { "TLD": "ES", "CountryName": "Spain" }, { "TLD": "LK", "CountryName": "Sri Lanka" }, { "TLD": "SD", "CountryName": "Sudan" }, { "TLD": "SR", "CountryName": "Suriname" }, { "TLD": "SJ", "CountryName": "Svalbard" }, { "TLD": "SZ", "CountryName": "Swaziland" }, { "TLD": "SE", "CountryName": "Sweden" }, { "TLD": "CH", "CountryName": "Switzerland" }, { "TLD": "SY", "CountryName": "Syria" }, { "TLD": "TW", "CountryName": "Taiwan" }, { "TLD": "TJ", "CountryName": "Tajikistan" }, { "TLD": "TZ", "CountryName": "Tanzania" }, { "TLD": "TH", "CountryName": "Thailand" }, { "TLD": "GM", "CountryName": "The Gambia" }, { "TLD": "TG", "CountryName": "Togo" }, { "TLD": "TK", "CountryName": "Tokelau" }, { "TLD": "TO", "CountryName": "Tonga" }, { "TLD": "TT", "CountryName": "Trinidad and Tobago" }, { "TLD": "TN", "CountryName": "Tunisia" }, { "TLD": "TR", "CountryName": "Turkey" }, { "TLD": "TM", "CountryName": "Turkmenistan" }, { "TLD": "TC", "CountryName": "Turks and Caicos Islands" }, { "TLD": "TV", "CountryName": "Tuvalu" }, { "TLD": "UG", "CountryName": "Uganda" }, { "TLD": "UA", "CountryName": "Ukraine" }, { "TLD": "AE", "CountryName": "United Arab Emirates" }, { "TLD": "UK", "CountryName": "United Kingdom" }, { "TLD": "US", "CountryName": "United States" }, { "TLD": "UM", "CountryName": "United States Minor Outlying Islands" }, { "TLD": "UY", "CountryName": "Uruguay" }, { "TLD": "UZ", "CountryName": "Uzbekistan" }, { "TLD": "VU", "CountryName": "Vanuatu" }, { "TLD": "VE", "CountryName": "Venezuela" }, { "TLD": "VN", "CountryName": "Vietnam" }, { "TLD": "VI", "CountryName": "Virgin Islands" }, { "TLD": "WF", "CountryName": "Wallis and Futuna" }, { "TLD": "EH", "CountryName": "Western Sahara" }, { "TLD": "YE", "CountryName": "Yemen" }, { "TLD": "YU", "CountryName": "Yugoslavia" }, { "TLD": "ZM", "CountryName": "Zambia" }, { "TLD": "ZW", "CountryName": "Zimbabwe" }];

            // add US at the beginning of the list
            System.CountriesData.splice(0, 0, {
                TLD: 'US', CountryName: 'United States'
            });

            // reset the global dictionary
            System.CountryDictionary = {};

            var countryList = [];

            $.each(System.CountriesData, function (i, item) {
                countryList.push(item.TLD + ":" + item.CountryName);
                System.CountryDictionary[item.TLD] = item.CountryName;
            });

            System.jqGridCountryList = ":;" + countryList.join(';');
        }

        return System.jqGridCountryList;
    };

    System.jqGridLoadSearchSaved = function (parameters) {
        var $table = $(parameters.tableid);
        var fid = parameters.mainGridTableId.substring(1);
        var loadSearchBoxButtonClass = parameters.tableid.substring(1) + '-loadsearchbox';
        var $mainTable = $(parameters.mainGridTableId);
        var showAllContacts = false;

        var $hiddengrid = typeof (parameters.hiddengrid)
            !== 'undefined' ? parameters.hiddengrid : false;

        var searchOptions = {
            multipleSearch: true,
            multipleGroup: true,
            recreateFilter: true,
            sopt: ['cn', 'nc', 'eq', 'ne', 'lt', 'le', 'gt', 'ge', 'bw', 'bn', 'in', 'ni', 'ew', 'en', 'nu', 'nn'],
            showQuery: true,
            overlay: false
        };

        $table.jqGrid({
            caption: "<i class='fa fa-thumb-tack'></i>&nbsp;Saved Searches",
            editurl: '/Account/SavedSearchListHistories',
            url: '/Account/SavedSearchListHistories',
            // specify the table to select only data for that table
            postData: $.extend(typeof parameters.postData === 'undefined' ? {} : parameters.postData, { SearchType: fid }),
            datatype: "json",
            colNames: ['ID', 'Name', 'Search', 'Filter', 'Options', 'Modified By'],
            colModel: [
                { name: 'ID', width: 42, fixed: true, hidden: true, key: true },
                { name: 'Name', width: 40, sortable: true, editable: true },
                { name: 'Search', hidden: true, width: 20, viewable: true, sortable: false, search: true, searchoptions: { searchhidden: true }, editable: false, edittype: "textarea", editrules: { edithidden: true }, editoptions: { rows: "2", cols: "10" } },
                { name: 'Filter', hidden: true, width: 20, viewable: true, sortable: false, search: true, searchoptions: { searchhidden: true }, editable: false, edittype: "textarea", editrules: { edithidden: true }, editoptions: { rows: "2", cols: "10" } },
                { name: 'Options', width: 10, search: false, sortable: false, formatter: displayLoadButton },
                { name: 'ContactID', width: 15, hidden: true, viewable: true, sortable: true, search: true, stype: "select", searchoptions: { searchhidden: true, sopt: ['eq', 'ne'], value: parameters.Employees }, formatter: System.jqGridAccountDetailLinkFormatter }
            ],
            hiddengrid: $hiddengrid,
            rowNum: 10,
            rowList: [10, 20, 30, 50, 75, 100, 200, 500, 1000],
            viewrecords: true,
            pager: parameters.tableid + '-pager',
            scroll: true,
            scrollrows: true,
            autowidth: true,
            gridview: false, // required for afterInsertRow event
            sortname: 'Name',
            sortorder: "asc",
            height: 100,
            mtype: 'GET',
            jsonReader: {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                userdata: "userdata"
            },
            afterInsertRow: function (rowid, rowdata, rowelem) {
                var htmlRow = $($table.jqGrid('getInd', rowid, true));

                if (parameters.loadSearchBoxButton === true) {
                    htmlRow.find('.' + loadSearchBoxButtonClass).click(function () {
                        $("#fbox_" + fid).jqFilter('addFilter', rowdata.Filter);
                        $mainTable.jqGrid('setGridParam', {
                            postData: { filters: rowdata.Filter },
                            search: true
                        }).trigger("reloadGrid");
                        $(window).scrollTop($('#searchmodfbox_' + fid).position().top);
                    });
                }
            },
            gridComplete: function () {
                // hide the pager
                $(parameters.tableid + '-pager_center').css("cssText", "width: 0 !important");

                // resize the grid when window's resize event triggers
                $.jgrid.resizeOnWindowResizeEvent($(this));
            }
        }).jqGrid('navGrid', parameters.tableid + '-pager',
            { search: true, view: true, del: true, add: false, edit: false, refresh: true },
            { closeAfterEdit: true }, // default settings for edit
            {}, // default settings for add
            {}, // delete options
            searchOptions, // search options
            {} /* view parameters*/
        )
        .jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: 'cn' })
        .jqGrid('inlineNav', parameters.tableid + '-pager', {
            add: false,
            editParams: { aftersavefunc: function () { $table.trigger("reloadGrid"); } }
        });

        $table.jqGrid('navButtonAdd', parameters.tableid + '-pager', { // Add the column selector button
            caption: "",
            title: "Show/Hide Columns",
            buttonicon: "ui-icon-bookmark",
            onClickButton: function () {
                jQuery(this).jqGrid('columnChooser', {
                    width: 500,
                    msel_opts: { dividerLocation: 0.5 },
                    done: function () {
                        /* resize to fit the columns */
                        $(window).trigger('resize');
                    }
                });
            },
            position: "last"
        });

        function displayLoadButton(cellvalue, options, rowObject) {
            var result = [];

            result.push('<ul>');
            if (parameters.loadSearchBoxButton === true) {
                result.push('<li class="' + loadSearchBoxButtonClass + ' ui-state-default ui-corner-all" ');
                result.push('style="margin:2px;position:relative;padding:0;cursor:pointer;float:left;list-style:none;">');
                result.push('<span class="ui-icon ui-icon-search" title="Search using this filter"></span></li>');
            }
            result.push('</ul>');

            return result.join('');
        }
    };

    System.startTimer = function ($outputElement) {
        if (typeof Tock === 'undefined' || typeof $outputElement === 'undefined') {
            return null;
        }

        // create the timer object
        var timer = new Tock({
            countdown: false,
            interval: 10,
            callback: function () {
                if (typeof moment !== 'undefined') {
                    $outputElement.text(moment.utc(timer.lap()).format('HH:mm:ss.SSS'));
                }
            }
        });

        // start the timer
        timer.start();

        // store the timer object
        $outputElement.data('timer', timer);

        return timer;
    };

    System.stopTimer = function ($element) {
        if (typeof Tock !== 'undefined' && typeof $element !== 'undefined') {
            var $timer = $element.data('timer');
            $timer.stop();
        }
    };

    // default function to help animate the jump to the given element
    System.animateToElement = function ($element) {
        jQuery('html:not(:animated),body:not(:animated)')
        .animate({ scrollTop: $element.offset().top }, 800);
    };

    // returns a unique number for this session
    System._nextUniqueID = 0;
    System.nextUniqueID = function () {
        return ++System._nextUniqueID;
    };
}