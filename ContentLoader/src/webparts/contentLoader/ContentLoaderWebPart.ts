import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPHttpClient } from "@microsoft/sp-http";
import { SPComponentLoader } from '@microsoft/sp-loader';
import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneCheckbox } from '@microsoft/sp-property-pane';

//import styles from './ContentLoaderWebPart.module.scss';

export interface IContentLoaderWebPartProps {
  url: string;
  loadPC: boolean;
  loadSP: boolean;
}

export default class ContentLoaderWebPart extends BaseClientSideWebPart<IContentLoaderWebPartProps> {

  private evalScript(el: HTMLFormElement): void {
    const data = (el.text || el.textContent || el.innerHTML || "");
    const headTag = document.getElementsByTagName("head")[0] || document.documentElement;
    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";

    if (el.src && el.src.length > 0) {
      return;
    }

    if (el.onload && el.onload.length > 0) {
      scriptTag.onload = el.onload;
    }

    try {
      scriptTag.appendChild(document.createTextNode(data));
    }
    catch (e) {
      scriptTag.text = data;
    }

    headTag.insertBefore(scriptTag, headTag.firstChild);
    headTag.removeChild(scriptTag);
  }

  private nodeName(el: HTMLElement, name: string): boolean {
    return el.nodeName && el.nodeName.toUpperCase() === name.toUpperCase();
  }

  private async executeScript(el: HTMLElement): Promise<void> {
    const w = (window as any);

    w.ScriptGlobal = {};

    const scripts = [];
    const children_nodes = el.childNodes;

    for (let i = 0; children_nodes[i]; i++) {
      const child: any = children_nodes[i];
      if (this.nodeName(child, "script") && (!child.type || child.type.toLowerCase() === "text/javascript")) {
        scripts.push(child);
      }
    }

    const urls = [];
    const onLoads = [];
    for (let i = 0; scripts[i]; i++) {
      const scriptTag = scripts[i];
      if (scriptTag.src && scriptTag.src.length > 0) {
        urls.push(scriptTag.src);
      }
      if (scriptTag.onload && scriptTag.onload.length > 0) {
        onLoads.push(scriptTag.onload);
      }
    }

    let oldamd = null;
    if (w.define && w.define.amd) {
      oldamd = w.define.amd;
      w.define.amd = null;
    }

    for (let i = 0; i < urls.length; i++) {
      try {
        await SPComponentLoader.loadScript(urls[i], { globalExportsName: "ScriptGlobal" });
      }
      catch (err) {
        console.error(err);
      }
    }

    if (oldamd) {
      w.define.amd = oldamd;
    }

    for (let i = 0; scripts[i]; i++) {
      const scriptTag = scripts[i];
      if (scriptTag.parentNode) { scriptTag.parentNode.removeChild(scriptTag); }
      this.evalScript(scripts[i]);
    }

    for (let i = 0; onLoads[i]; i++) {
      onLoads[i]();
    }
  }

  public render(): void {

    if (this.properties.url) {

      const w = (window as any);

      if (this.properties.loadPC) {
        if (!w._spPageContextInfo) { w._spPageContextInfo = this.context.pageContext.legacyPageContext; }
      }

      if (this.properties.loadSP) {
        if (!w.SP) {
          SPComponentLoader.loadScript('/_layouts/15/init.js', { globalExportsName: '$_global_init' })
          .then((): Promise<{}> => SPComponentLoader.loadScript('/_layouts/15/MicrosoftAjax.js', { globalExportsName: 'Sys' }))
          .then((): Promise<{}> => SPComponentLoader.loadScript('/_layouts/15/SP.Runtime.js', { globalExportsName: 'g_all_modules' }))
          .then((): void => {SPComponentLoader.loadScript('/_layouts/15/SP.js', { globalExportsName: 'SP' }).catch(() => undefined)})
          .catch(() => undefined);
        }
      }

      this.context.spHttpClient.get(`${this.properties.url}`, SPHttpClient.configurations.v1)
      .then((response) => response.text())
      .then((responseText) => {this.domElement.innerHTML = responseText; this.executeScript(this.domElement).catch(() => undefined)})
      .catch(() => undefined);
    }
    else {
      this.domElement.innerHTML = 'Edit this web part and provide content URL.';
    }

  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Enter URL to a text file.'
          },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('url', {
                  label: 'URL'
                }),
                PropertyPaneCheckbox('loadPC', {
                  text: 'Load page context information',
                  checked: false
                }),
                PropertyPaneCheckbox('loadSP', {
                  text: 'Load SP.js and its dependencies',
                  checked: false
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}