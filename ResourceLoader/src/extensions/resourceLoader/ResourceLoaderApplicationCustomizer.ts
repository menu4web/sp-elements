import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';
import { SPComponentLoader } from '@microsoft/sp-loader';

//import * as strings from 'ResourceLoaderApplicationCustomizerStrings';

//const LOG_SOURCE: string = 'ResourceLoaderApplicationCustomizer';

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

  private resources(): void {
    const w = (window as any);
    w.SPe.Util.wait(w.SPe.resources);
  }

  private history(): void {
    ((h) => {
      var pushState = h.pushState;
      h.pushState = (state, key, path) => {
          pushState.apply(h, [state, key, path]);
          this.resources();
      };
    })(window.history);
    window.addEventListener('popstate', () => this.resources());
  }

  public onInit(): Promise<void> {
    const w = (window as any);

    if (!w._spPageContextInfo) { w._spPageContextInfo = this.context.pageContext.legacyPageContext; }

    SPComponentLoader.loadScript('/libs/SPe.js', { globalExportsName: 'SPe' })
    .then((): Promise<{}> => SPComponentLoader.loadScript(this.context.pageContext.web.absoluteUrl + '/SiteAssets/Resources.js', { globalExportsName: 'SPe' }))
    .then((): void => { if (w.SPe.resources) { this.history() } })
    .catch(() => undefined);

    return Promise.resolve();
  }
}