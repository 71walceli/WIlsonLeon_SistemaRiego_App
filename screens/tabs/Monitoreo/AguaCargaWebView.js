import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

// Importa la imagen desde los activos
const waveImage = require('../../../assets/efecto_agua.png');

const AguaCargaWebView = ({ loadingText,loadingText1 }) => {
  const webViewRef = useRef(null);


  const chartHtml = `
    <!DOCTYPE html>
    <html style="height: 100%; width:100%;">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>ECharts</title>
      <style>
        *{
            padding: 0;
            margin: 0;
        }
        body{
          font-family: "Work Sans",sans-serif;
          letter-spacing:2px;
          background:black;
          display:flex;
          height:100vh;
          width:100vw;
          justify-content: center;
          align-items: center;
        }
        
        h2{
          font-size:3.3rem;
          position:absolute;          
        }

        #primero{
          position:absolute;  
          top:15%;
        }
        #primero1{
          position:absolute;  
          top:15%;
        }

        #segundo{
          position:absolute;  
          top:50%;
        }
        #segundo1{
          position:absolute;  
          top:50%;
        }
        .border{
          color:black;
          text-shadow: 
              -1px -1px 0 white,
              -1px -1px 0 white,
              1px 1px 0 white,
              1px -1px 0 white;
        }
        .border1{
          color:black;
          text-shadow: 
              -1px -1px 0 white,
              -1px -1px 0 white,
              1px 1px 0 white,
              1px -1px 0 white;
        }
        .wave{
          color:#09f;
          animation:wave 3s ease-in-out infinite;
        }
        .wave1{

          color:#09f;
          animation:wave 3s ease-in-out infinite;
        }

        @keyframes wave {
          0%, 100% {
            clip-path: polygon(0% 47%, 10% 48%, 33% 54%, 54% 60%, 70% 61%, 84% 59%, 100% 52%, 100% 100%, 0% 100%);
          }
          50% {
            clip-path: polygon(0% 60%, 15% 65%, 34% 66%, 51% 62%, 67% 50%, 84% 45%, 100% 46%, 100% 100%, 0% 100%);
          }
        }
      </style>
    </head>
    <body>
      <h2 id="primero" class="border">${loadingText1}</h2>
      <h2 id="primero1" class="wave">${loadingText1}</h2>
      <h2 id="segundo" class="border1">${loadingText}</h2>
      <h2 id="segundo1" class="wave1">${loadingText}</h2>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: chartHtml }}
        style={{ width: 315, height: 200 }}
      />
    </View>
  );
};


export default AguaCargaWebView;
