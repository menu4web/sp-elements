import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneCheckbox } from '@microsoft/sp-property-pane';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { SPHttpClient } from "@microsoft/sp-http";

export interface IContentLoaderWebPartProps {
  url: string;
  loadPC: boolean;
  loadSP: boolean;
}

export default class ContentLoaderWebPart extends BaseClientSideWebPart<IContentLoaderWebPartProps> {

  private evalScript(el: any) {
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

  private nodeName(el: HTMLElement, name: string) {
    return el.nodeName && el.nodeName.toUpperCase() === name.toUpperCase();
  }

  private async executeScript(el: HTMLElement) {
    (<any>window).ScriptGlobal = {};

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
    if (window["define"] && window["define"].amd) {
      oldamd = window["define"].amd;
      window["define"].amd = null;
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
      window["define"].amd = oldamd;
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

      let w = (window as any);

      if (this.properties.loadPC) {
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
      }

      if (this.properties.loadSP) {
        if (!w.SP) {
          SPComponentLoader.loadScript('/_layouts/15/init.js', { globalExportsName: '$_global_init' })
          .then((): Promise<{}> => {
            return SPComponentLoader.loadScript('/_layouts/15/MicrosoftAjax.js', { globalExportsName: 'Sys' });
          })
          .then((): Promise<{}> => {
            return SPComponentLoader.loadScript('/_layouts/15/SP.Runtime.js', { globalExportsName: 'g_all_modules' });
          })
          .then((): void => {
            SPComponentLoader.loadScript('/_layouts/15/SP.js', { globalExportsName: 'SP' });
          });
        }
      }

      this.context.spHttpClient.get(`${escape(this.properties.url)}`, SPHttpClient.configurations.v1)  
      .then((response) => {
        return response.text();
      })
      .then((responseText) => {
        this.domElement.innerHTML = responseText;
        this.executeScript(this.domElement);
      });
    }
    else {
      this.domElement.innerHTML = 'Edit this web part and provide content URL.';
    }
  
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
}