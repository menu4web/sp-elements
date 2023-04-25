$siteURL = "https://menu4web.sharepoint.com/sites/Test3"
$listName = "Requests"
$templateName = "requests.stp"

$path = [regex]::Replace($MyInvocation.MyCommand.Definition, "\\saveListTemplate.ps1", "")
cd $path

Connect-PnPOnline -Url $siteURL -UseWebLogin

Get-PnPProvisioningTemplate -Handlers Lists -ListsToExtract $listName -Out ("{0}.xml" -f $templateName)
Add-PnPDataRowsToProvisioningTemplate -path ("{0}.xml" -f $templateName) -List $listName -Query '<view></view>'