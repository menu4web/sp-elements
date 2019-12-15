import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'ResourceLoaderApplicationCustomizerStrings';

const LOG_SOURCE: string = 'ResourceLoaderApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IResourceLoaderApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ResourceLoaderApplicationCustomizer
  extends BaseApplicationCustomizer<IResourceLoaderApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {

    let w = (window as any);
    if (!w._spPageContextInfo) {
      w._spPageContextInfo = this.context.pageContext.legacyPageContext;
    }

    if (!document.getElementById('__REQUESTDIGEST')) {
      let digestValue = this.context.pageContext.legacyPageContext.formDigestValue;
      let requestDigestInput: Element = document.createElement('input');
      requestDigestInput.setAttribute('type', 'hidden');
      requestDigestInput.setAttribute('name', '__REQUESTDIGEST');
      requestDigestInput.setAttribute('id', '__REQUESTDIGEST');
      requestDigestInput.setAttribute('value', digestValue);
      document.body.appendChild(requestDigestInput);
    }

    SPComponentLoader.loadScript('/_layouts/15/init.js', { globalExportsName: '$_global_init' })
    .then((): Promise<{}> => {
      return SPComponentLoader.loadScript('/_layouts/15/MicrosoftAjax.js', { globalExportsName: 'Sys' });
    })
    .then((): Promise<{}> => {
      return SPComponentLoader.loadScript('/_layouts/15/SP.Runtime.js', { globalExportsName: 'g_all_modules' });
    })
    .then((): Promise<{}> => {
      return SPComponentLoader.loadScript('/_layouts/15/SP.js', { globalExportsName: 'SP' });
    })
    .then((): Promise<{}> => {
      return SPComponentLoader.loadScript('/libs/SPe.js', { globalExportsName: 'SPe' });
    })
    .then((): void => {
      SPComponentLoader.loadScript(this.context.pageContext.web.absoluteUrl + '/SiteAssets/Resources.js', { globalExportsName: 'SPe' });
    });

    return Promise.resolve();
  }
}