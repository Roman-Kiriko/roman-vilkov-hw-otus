interface Window {
    VK: VK,
    ODKL: ODKL
}
interface ODKL {
    updateCount?: Function
}
interface VK {
    Share?: object
}

interface Buttons {
  services: Object;
  openPopup(url: string, opt: Option): void;
  init(): void;
}

interface ObjectServices {
 title?: string
 counterUrl?: string
 popupUrl?: string
 width: number
 height: number
 count?: string | Function
}

interface SocialNetworks {
    facebook?: ObjectServices
    twitter?: ObjectServices
    pinterest?: ObjectServices
    mailru?: ObjectServices
    gplus?: ObjectServices
    odnoklassniki?: ObjectServices
    vkontakte?: ObjectServices
}

type ObjectEl = {
  name: string;
  option?: OptionEl;
  btn?: HTMLButtonElement;
  icon?: HTMLElement;
  title?: HTMLElement;
  count?: HTMLElement;
};

type OptionEl = {
  url: string;
  title: string;
  media: string;
  start: string;
};

type Option = {
  height: number;
  width: number;
};


class SocialButtons implements Buttons {
  private CB = {};
  public services: SocialNetworks;
  constructor(services: SocialNetworks) {
      this.services = services
  }

  template(str: string, obj: object): string {
    return str.replace(/\{([^\}]+)\}/g, (m, k) => obj[k] || m);
  }

  JS(url: string): void {
    const script: HTMLScriptElement = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
  }
  JSONP(url: string, callback: Function, error: Function): void {
    const callbackName: string = String(Math.random()).slice(-6);
    let scriptOK: boolean = false;

    this.CB["cb" + callback] = function (data: Object): void {
      scriptOK = true;
      delete this.CB[callbackName];
      callback(data);
    }.bind(this);

    const checkCallback = function (): void {
      if (scriptOK) return;
      delete this.CB[callbackName];
      error(url);
    }.bind(this);

    const script: HTMLScriptElement = document.createElement("script");
    script.onload = script.onerror = checkCallback;
    script.src =
      this.template(url, { cb: "SocialButtons.CB.cb" + callbackName }) + "&";
    document.body.appendChild(script);
  }

  JSON(url: string, callback: Function, error: Function): void {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function (): void {
      if (xhr.readyState != 4) return;
      if (xhr.status == 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        if (error) error(xhr);
      }
    };
    xhr.send();
  }

  getCount(el: ObjectEl, callback: Function, error: Function): void {
    const protocol: string = location.protocol === "https" ? "https" : "http";
    const url = this.template(
      protocol + this.services[el.name].counterUrl,
      el.option
    );

    if (typeof this.services[el.name].count === "function") {
      this.JS(url);
      this.services[el.name].count(callback);
    } else {
      this[/\{cb\}/.test(url) ? "JSONP" : "JSON"](
        url,
        (data: object): void =>
          callback(data[this.services[el.name].count || "count"]),
        error
      );
    }
  }

  openPopup(url: string, opt: Option): void {
    const left: number = Math.round(screen.width / 2 - opt.width / 2);
    const top: number =
      screen.height > opt.height
        ? Math.round(screen.height / 3 - opt.height / 2)
        : 0;
    const features: string = `left=${left},top=${top},width=${opt.width},height=${opt.height},personalbar=0,toolbar=0,scrollbars=1,resizeble=1`;
    const win: Window = window.open(url, "-", features);

    if (win) {
      win.focus();
    } else {
      location.href = url;
    }
  }

  init(): void {
    const container: HTMLElement = document.querySelector(".social-buttons");
    const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
      ".social-buttons > div"
    );

    btns.forEach((btn) => {
      const el: ObjectEl = {
        name: btn.className,
        btn,
      };

      el.option = {
        url:
          btn.getAttribute("data-url") ||
          container.getAttribute("data-url") ||
          window.location.href,
        title:
          btn.getAttribute("data-title") ||
          container.getAttribute("data-title") ||
          document.title,
        media:
          btn.getAttribute("data-media") ||
          container.getAttribute("data-media") ||
          "",
        start: btn.getAttribute("data-start"),
      };
      el.icon = fabricElement("span", "icon");

      el.title = fabricElement("span", "title");
      el.title.innerText = btn.innerText || this.services[el.name].title;

      el.count = fabricElement("span", "count");

      el.btn.innerHTML = "";

      const appendArr: string[] = ["icon", "title", "count"];
      for (let str of appendArr) {
        el.btn.appendChild(el[str]);
      }
      el.btn.addEventListener("click", () => {
        this.openPopup(
          this.template(this.services[el.name].popupUrl, el.option),
          this.services[el.name]
        );
      });

      this.getCount(
        el,
        function (count: any) {
          count = parseInt(count) || el.option.start;
          if (count) {
            el.count.innerText = count;
          } else {
            el.count.parentNode.removeChild(this.count);
          }
        },
        () => {
          el.count.parentNode.removeChild(el.count);
        }
      );
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const socialButtons = new SocialButtons(services);
  socialButtons.init();
});

// utilits
function fabricElement(tagName: string, className: string): HTMLElement {
  const el: HTMLElement = document.createElement(tagName);
  el.classList.add(className);
  return el;
}

// data
const services: SocialNetworks = {
    facebook: {
      title: "Share",
      counterUrl: "//graph.facebook.com/?id={url}",
      popupUrl: "https://www.facebook.com/sharer/sharer.php?u={url}",
      count: "shares",
      width: 600,
      height: 500,
    },
    twitter: {
      title: "Tweet",
      counterUrl:
        "//cdn.api.twitter.com/1/urls/count.json?url={url}&callback={cb}",
      popupUrl: "https://twitter.com/intent/tweet?url={url}&text={title}",
      width: 600,
      height: 450,
    },
    pinterest: {
      title: "Pin it",
      counterUrl:
        "//api.pinterest.com/v1/urls/count.json?url={url}&callback={cb}",
      popupUrl:
        "https://pinterest.com/pin/create/button/?url={url}&description={title}",
      width: 630,
      height: 270,
    },
    mailru: {
      counterUrl:
        "//connect.mail.ru/share_count?url_list={url}&callback=1&func={cb}",
      popupUrl: "http://connect.mail.ru/share?share_url={url}&title={title}",
      count: "shares",
      width: 550,
      height: 360,
    },
    odnoklassniki: {
      title: "Share",
      counterUrl: "//connect.ok.ru/dk?st.cmd=extLike&ref={url}&uid={index}",
      popupUrl:
        "http://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl={url}",
      count: function (cb: Function) {
        if(!window.ODKL) window.ODKL = {}
        window.ODKL.updateCount = function (_, count) {
          cb(count);
        };
      },
      width: 550,
      height: 360,
    },
    vkontakte: {
      title: "Share",
      counterUrl: "//vk.com/share.php?act=count&url={url}",
      popupUrl: "http://vk.com/share.php?url={url}&title={title}",
      count: function (cb: Function) {
          if(!window.VK) window.VK = {}
        window.VK.Share = {
          count: function (_, count) {
              console.log(typeof count)
            cb(count);
          },
        };
      },
      width: 550,
      height: 330,
    },
  }
