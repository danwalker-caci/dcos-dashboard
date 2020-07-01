<%@ Page Language="C#" Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=14.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="PublishingNavigation" Namespace="Microsoft.SharePoint.Publishing.Navigation" Assembly="Microsoft.SharePoint.Publishing, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceholderID="PlaceHolderAdditionalPageHead" runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE10" />
	<SharePointWebControls:UIVersionedContent UIVersion="4" runat="server">
		<ContentTemplate>
			<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Core Styles/page-layouts-21.css %>" runat="server"/>
      <SharePointWebControls:ScriptLink Language="javascript" Name="~sitecollection/SiteAssets/js/highcharts.js" Defer="true" runat="server" Localizable="false" />
			<SharePointWebControls:ScriptLink Language="javascript" Name="~sitecollection/SiteAssets/js/exporting.js" Defer="true" runat="server" Localizable="false" />
      <PublishingWebControls:EditModePanel runat="server">
				<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Core Styles/edit-mode-21.css %>" After="<% $SPUrl:~sitecollection/Style Library/~language/Core Styles/page-layouts-21.css %>" runat="server"/>
			</PublishingWebControls:EditModePanel>
            <style type="text/css">
                body #s4-leftpanel {
                    display: none !important;
                }

                .s4-ca {
                    margin-left: 0px !important;
                }
            </style>
		</ContentTemplate>
	</SharePointWebControls:UIVersionedContent>
</asp:Content>
<asp:Content ContentPlaceholderID="PlaceHolderPageTitle" runat="server">
	<SharePointWebControls:UIVersionedContent UIVersion="4" runat="server">
		<ContentTemplate>
			DCOS - <SharePointWebControls:ListProperty Property="Title" runat="server"/> - <SharePointWebControls:FieldValue FieldName="Title" runat="server"/>
		</ContentTemplate>
	</SharePointWebControls:UIVersionedContent>
</asp:Content>
<asp:Content ContentPlaceholderID="PlaceHolderMain" runat="server">
	<div class="container-fluid">
        <div class="row">
    	    <div class="col-12 padlr5">
    		    <WebPartPages:WebPartZone runat="server" Title="Left" ID="WPZLeft"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
    	    </div>
        </div>
    </div>
</asp:Content>
