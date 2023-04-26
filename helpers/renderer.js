import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";

import { StaticRouter } from "react-router-dom";
import Routes from "../client/Routes";
import { renderRoutes } from "react-router-config";

import { Provider } from "react-redux";
import serialize from "serialize-javascript";

import { ChunkExtractor } from "@loadable/server";
import { Helmet } from "react-helmet";

export default async (req, store, context) => {
  const statsFile = path.resolve("./dist/loadable-stats.json");
  const extractor = new ChunkExtractor({ statsFile });

  const content = renderToString(
    extractor.collectChunks(
      <Provider store={store}>
        <StaticRouter location={req.path} context={context}>
          {renderRoutes(Routes)}
        </StaticRouter>
      </Provider>
    )
  );

  const storeRehydrationState = serialize(store.getState());

  const scriptTags = extractor.getScriptTags();

  const styleTags = extractor.getStyleTags();

  // let bootupHTML = await readFileAsync("./dist/bootup.html");

  // bootupHTML = bootupHTML.replace(
  //   /<script[^>]*>(?:(?!<\/script>)[^])*<\/script>/g,
  //   ""
  // );
  // bootupHTML = bootupHTML.replace(
  //   "<!-- __STORE_REHYDRATION_STATE__ -->",
  //   `<script>window.__STORE_REHYDRATION_STATE__ = ${storeRehydrationState};</script>
  //   ${scriptTags}`
  // );

  // bootupHTML = bootupHTML.replace(
  //   '<div id="root"></div>',
  //   `<div id="root">${content}</div>`
  // );

  // <script type="text/javascript" src="https://storage.googleapis.com/safepayobjects/api/safepay-checkout.min.js"></script>
  //

  const helmet = Helmet.renderStatic();
  const { base_url = "/" } = req;

  let bootupHTML = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      ${helmet.meta.toString()}
      <meta name="facebook-domain-verification" content="i7mqwg501lm35gbv4c0sjuduiu2zan" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <link rel="icon" href="/images/favicon.png">

      <title>Out-Class</title>
      <base href="/">
      <link
      rel="stylesheet"
      href="https://pro.fontawesome.com/releases/v5.2.0/css/all.css"
      />
      <link
      rel="stylesheet"
      href="https://vjs.zencdn.net/5.4.6/video-js.min.css"
      />
      
      ${styleTags}

      <script src="/js/jquery-3.5.1.min.js"></script>
      
      <script src="/js/jquery.carousel.min.js"></script>
      <script src="/js/mousewheel.js"></script>
      

      <!-- BANK ALFALAH-->

     
     
     
    
      <!-- Facebook Pixel Code -->
      <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '390933811965699'); 
      fbq('track', 'PageView');
      </script>
      <noscript>
      <img height="1" width="1" 
      src="https://www.facebook.com/tr?id=390933811965699&ev=PageView
      &noscript=1"/>
      </noscript>
      <!-- End Facebook Pixel Code -->


      <!-- Global site tag (gtag.js) - Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-J3RB34VRE2"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-J3RB34VRE2');
        gtag('config', 'AW-458348445');
      </script>


          <script>
            function initializeQuickCarousal () {
              try{
                console.log("Re Running");
                $(".quick-carousel").carousel({
                  carouselWidth: 230,
                  carouselHeight: 190,
                  directionNav: true,
                  frontWidth: 160,
                  frontHeight: 170,
                  hMargin: 0.8,
                });
              } catch (err) {
                console.log("SLIDER EXCEPTION",err)
              }
            }
            window.initializeQuickCarousal = initializeQuickCarousal;
          </script>


    </head>
  
    <body>

    <script src="https://bankalfalah.gateway.mastercard.com/checkout/version/56/checkout.js"
      data-error="errorCallback"
      data-complete="api/cart/bank_alfalah_payment"
      
      data-timeout="timeoutCallback"
    >
    </script>
  

  <script>
 
    function errorCallback(error) {
      alert("errorCallback function") ;
      console.log(JSON.stringify(error));
      // document.getElementById("state").value = "errorCallback" ;
    }

    function cancelCallback() {

      if(window.cancelBankAlfalahCheckout) {
        window.cancelBankAlfalahCheckout()
      }
        // alert("cancelCallback function") ;
        console.log('Payment cancelled');
        // document.getElementById("state").value = "cancelCallback" ;
    }

    function timeoutCallback() {
        alert("timeoutCallback function") ;
        console.log('Payment timedout');
        // document.getElementById("state").value = "timeoutCallback" ;
    }

    // function completeCallback(resultIndicator, sessionVersion) {

    //   alert("completeCallback function") ;
    //     // document.getElementById("state").value = "completeCallback" ;
    // }
  </script>


      <div id="root">${content}</div>
      <script>window.__STORE_REHYDRATION_STATE__ = ${storeRehydrationState};</script>
      ${scriptTags}

    </body>
  </html>
  `;
  return bootupHTML;
};
