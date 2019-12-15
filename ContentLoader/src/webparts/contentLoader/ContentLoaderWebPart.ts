import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { SPHttpClient } from "@microsoft/sp-http";  

import * as strings from 'ContentLoaderWebPartStrings';

export interface IContentLoaderWebPartProps {
  url: string;
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
      this.context.spHttpClient.get(`${escape(this.properties.url)}`, SPHttpClient.configurations.v1)  
      .then((response) => {
        return response.text();
      })
      .then((value) => {
        this.domElement.innerHTML = value;
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}