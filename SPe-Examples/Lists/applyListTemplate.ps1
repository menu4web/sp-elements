$siteURL =  "https://menu4web.sharepoint.com/sites/Test3"
$templateName = "requests.stp"

$path = [regex]::Replace($MyInvocation.MyCommand.Definition, "\\applyListTemplate.ps1", "")
cd $path

Connect-PnPOnline -Url $siteURL

Apply-PnPProvisioningTemplate -Path ("{0}.xml" -f $templateName)



