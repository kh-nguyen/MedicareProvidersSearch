using System;
using System.Web;
using System.Web.Optimization;

namespace MedicareProvidersSearch
{
    public class BundleConfig
    {
        public static readonly string[][] JQUERY_UI_THEMES = new string[][] {
            new string [] { "black-tie", "theme_90_black_tie.png", "Black Tie" },
            new string [] { "blitzer", "theme_90_blitzer.png", "Blitzer" },
            new string [] { "cupertino", "theme_90_cupertino.png", "Cupertino" },
            new string [] { "dark-hive", "theme_90_dark_hive.png", "Dark Hive" },
            new string [] { "dot-luv", "theme_90_dot_luv.png", "Dot Luv" },
            new string [] { "eggplant", "theme_90_eggplant.png", "Eggplant" },
            new string [] { "excite-bike", "theme_90_excite_bike.png", "Excite Bike" },
            new string [] { "flick", "theme_90_flick.png", "Flick" },
            new string [] { "hot-sneaks", "theme_90_hot_sneaks.png", "Hot Sneaks" },
            new string [] { "humanity", "theme_90_humanity.png", "Humanity" },
            new string [] { "le-frog", "theme_90_le_frog.png", "Le Frog" },
            new string [] { "mint-choc", "theme_90_mint_choco.png", "Mint Choc" },
            new string [] { "overcast", "theme_90_overcast.png", "Overcast" },
            new string [] { "pepper-grinder", "theme_90_pepper_grinder.png", "Pepper Grinder" },
            new string [] { "redmond", "theme_90_windoze.png", "Redmond" },
            new string [] { "smoothness", "theme_90_smoothness.png", "Smoothness" },
            new string [] { "south-street", "theme_90_south_street.png", "South Street" },
            new string [] { "start", "theme_90_start_menu.png", "Start" },
            new string [] { "sunny", "theme_90_sunny.png", "Sunny" },
            new string [] { "swanky-purse", "theme_90_swanky_purse.png", "Swanky Purse" },
            new string [] { "trontastic", "theme_90_trontastic.png", "Trontastic" },
            new string [] { "ui-darkness", "theme_90_ui_dark.png", "UI Darkness" },
            new string [] { "ui-lightness", "theme_90_ui_light.png", "UI Lightness" },
            new string [] { "vader", "theme_90_black_matte.png", "Vader" }
        };

        const string JQUERY_VERSION = "2.2.4";
        const string JQUERY_UI_VERSION = "1.12.0";
        const string JQGRID_VERSION = "4.13.4";
        const string BOOTSTRAP_VERSION = "3.3.7";
        const string FONT_AWESOME_VERSION = "4.5.0";
        const string ANGULARJS_VERSION = "1.5.2";
        const string MOMENTJS_VERSION = "2.11.2";
        const string TIMEAGO_VERSION = "1.4.1";
        const string TIMEPICKER_VERSION = "1.4.5";

        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.UseCdn = true;
            BundleTable.EnableOptimizations = true;

            #region jQuery
            bundles.Add(new ScriptBundle("~/bundles/jquery",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/jquery/{0}/jquery.min.js", JQUERY_VERSION))
                .Include("~/Scripts/jquery-{version}.js"));
            #endregion

            #region jQuery UI
            bundles.Add(new ScriptBundle("~/bundles/jqueryui",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/jqueryui/{0}/jquery-ui.min.js", JQUERY_UI_VERSION))
                .Include("~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/jqueryui/{0}/themes/cupertino/jquery-ui.min.css", JQUERY_UI_VERSION))
                .Include("~/Content/themes/cupertino/jquery-ui.css"));

            foreach (var item in JQUERY_UI_THEMES) {
                bundles.Add(new StyleBundle("~/Content/themes/" + item[0] + "/css",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/jqueryui/{0}/themes/{1}/jquery-ui.min.css", JQUERY_UI_VERSION, item[0]))
                .Include("~/Content/themes/" + item[0] + "/jquery-ui.css"));
            }
            #endregion

            #region jqGrid
            bundles.Add(new StyleBundle("~/bundles/jqgrid.css",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/free-jqgrid/{0}/css/ui.jqgrid.min.css", JQGRID_VERSION)).Include(
                "~/Scripts/jquery/plugins/jqGrid/css/ui.jqgrid.css"));

            bundles.Add(new StyleBundle("~/bundles/jqgrid.css/plugins/ui.multiselect.css",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/free-jqgrid/{0}/plugins/ui.multiselect.css", JQGRID_VERSION)).Include(
                "~/Scripts/jquery/plugins/jqGrid/plugins/ui.multiselect.css"));

            bundles.Add(new ScriptBundle("~/bundles/jqgrid.js",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/free-jqgrid/{0}/js/jquery.jqgrid.min.js", JQGRID_VERSION)).Include(
                "~/Scripts/jquery/plugins/jqGrid/js/jquery.jqgrid.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqgrid.js/plugins/ui.multiselect.js",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/free-jqgrid/{0}/plugins/ui.multiselect.js", JQGRID_VERSION)).Include(
                "~/Scripts/jquery/plugins/jqGrid/plugins/ui.multiselect.js"));
            #endregion

            #region Timepicker
            bundles.Add(new StyleBundle("~/bundles/timepicker/css",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/{0}/jquery-ui-timepicker-addon.min.css", TIMEPICKER_VERSION))
                .Include("~/Scripts/jquery/plugins/timepicker/dist/jquery-ui-timepicker-addon.css"));

            bundles.Add(new ScriptBundle("~/bundles/timepicker/js",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/{0}/jquery-ui-timepicker-addon.min.js", TIMEPICKER_VERSION))
                .Include("~/Scripts/jquery/plugins/timepicker/dist/jquery-ui-timepicker-addon.js"));
            #endregion

            #region Bootstrap
            bundles.Add(new StyleBundle("~/bundles/bootstrap/css",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/{0}/css/bootstrap.min.css", BOOTSTRAP_VERSION))
                .Include("~/Content/bootstrap.css"));

            bundles.Add(new StyleBundle("~/bundles/bootstrap/theme",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/{0}/css/bootstrap-theme.min.css", BOOTSTRAP_VERSION))
                .Include("~/Content/bootstrap-theme.css"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap/js",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/{0}/js/bootstrap.min.js", BOOTSTRAP_VERSION))
                .Include("~/Scripts/bootstrap.js"));
            #endregion

            #region Timeago
            bundles.Add(new ScriptBundle("~/bundles/timeago.js",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/jquery-timeago/{0}/jquery.timeago.min.js", TIMEAGO_VERSION))
                .Include("~/Scripts/jquery/plugins/timeago/jquery.timeago.js"));
            #endregion

            #region PNotify 2.0
            bundles.Add(new ScriptBundle("~/bundles/pnotify/js",
                "//cdnjs.cloudflare.com/ajax/libs/pnotify/2.0.0/pnotify.all.min.js")
                .Include("~/Scripts/jquery/plugins/pnotify/pnotify.all.min.js"));

            bundles.Add(new StyleBundle("~/bundles/pnotify/css",
                "//cdnjs.cloudflare.com/ajax/libs/pnotify/2.0.0/pnotify.all.min.css")
                .Include("~/Scripts/jquery/plugins/pnotify/pnotify.all.min.css"));
            #endregion

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/jquery.validate.js",
                "~/Scripts/jquery.validate.unobtrusive.js",
                "~/Scripts/jquery.validate.unobtrusive.extension.js"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr",
                "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js")
                .Include("~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/bundles/font-awesome",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/font-awesome/{0}/css/font-awesome.min.css", FONT_AWESOME_VERSION))
                .Include("~/Content/css/font-awesome.css"));

            bundles.Add(new ScriptBundle("~/bundles/angular",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/angular.js/{0}/angular.min.js", ANGULARJS_VERSION))
                .Include("~/Scripts/angular.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/moment",
                String.Format("//cdnjs.cloudflare.com/ajax/libs/moment.js/{0}/moment.min.js", MOMENTJS_VERSION))
                .Include("~/Scripts/moment.js"));

            bundles.Add(new ScriptBundle("~/bundles/tocktimer",
                "//cdnjs.cloudflare.com/ajax/libs/tocktimer/1.0.10/tock.min.js")
                .Include("~/Scripts/jquery/plugins/tocktimer/tock.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/extensions.*",
                "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/site/js")
                .Include("~/Scripts/Site.js"));

            bundles.Add(new ScriptBundle("~/bundles/account/js")
                .Include("~/Scripts/Medicare.js"));
        }
    }
}
