import React, { useRef, useEffect, useState } from 'react';
import { View, Dimensions,Pressable,StyleSheet,Text, ActivityIndicator } from 'react-native';
import { globalStyles } from '../../estilos/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';


const Rain = () => {
  const webViewRef = useRef(null);
  const [indice, setIndice] = useState(0);

  // Contenidos y porcentajes correspondientes
  const contenidos = [
    "Sin lluvia",
    "Lluvia leve",
    "Lluvia fuerte",
    "Lluvia muy fuerte"
  ];
  const porcentajes = [50, 4, 2, 1]; // Porcentajes correspondientes a cada contenido
  
  const [loading, setLoading] = useState(false);
  
  // Función para cambiar el índice circularmente cada 2 segundos
  const fetchData = async () => {
    if (loading) 
      return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=consultaLLuvia`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Puedes agregar email y password si es necesario para la autenticación
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const responseData = await response.json();
      const dates = responseData.message;
      let valorLluvia = Number(dates.estado);
      console.log('Datos obtenidos:', dates); // Mostramos los datos obtenidos por consola

      let condicionalLluvia;

      if (valorLluvia > 950) {
        condicionalLluvia = 0;
      } else if (valorLluvia <= 950 && valorLluvia > 600) {
        condicionalLluvia = 1;
      } else if (valorLluvia <= 600 && valorLluvia > 300) {
        condicionalLluvia = 2;
      } else {
        condicionalLluvia = 3;
      }

      setIndice((condicionalLluvia) % contenidos.length);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [indice]);

  const traerdatos = async () => {
    fetchData();
  };

  // Función para obtener el estilo left basado en el índice
  const obtenerEstiloLeft = () => {
    const porcentaje = porcentajes[indice];
    return `calc((var(--x) + 5) * ${porcentaje}%)`;
  };

  const chartHtml = `
   <!doctype html>
  <!--[if lte IE 9]>
  <html lang="en" class="oldie">
  <![endif]-->
  <!--[if gt IE 9]><!-->
  <html lang="en">
  <!--<![endif]-->
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <title>Pure CSS Random Rain with SVG and CSS Variables</title>
    <style>
      *,
      *:before,
      *:after {
        box-sizing: border-box;
      }
      body {
      overflow: hidden;
         text-align: center;
        display: -webkit-box;
        display: flex;
        -webkit-box-align: center;
                align-items: center;
        -webkit-box-pack: center;
                justify-content: center;
      }
      html {
        height: 100%;
        width: 100%;
      }
      .rain__drop {

        -webkit-animation-delay: calc(var(--d) * 1s);
                animation-delay: calc(var(--d) * 1s);
        -webkit-animation-duration: calc(var(--a) * 1s);
                animation-duration: calc(var(--a) * 1s);
        -webkit-animation-iteration-count: infinite;
                animation-iteration-count: infinite;
        -webkit-animation-name: drop;
                animation-name: drop;
        -webkit-animation-timing-function: linear;
                animation-timing-function: linear;
        height: 30px;
        position: absolute;
        left: ${obtenerEstiloLeft()};//AQUI calc((var(--x) + 5)* 1%) CONTROLO LA LLUVIA POR MEDIO DE EL PORCENTAJE
        right: calc((var(--x) - 50)* 5%);
        top: 35%;
      }
      .rain__drop path {
        fill: #a1c6cc;
        opacity: var(--o);
        -webkit-transform: scaleY(calc(var(--s) * 1.5));
                transform: scaleY(calc(var(--s) * 1.5));
      }
      @-webkit-keyframes drop {
        90% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          -webkit-transform: translateY(100vh);
                  transform: translateY(100vh);
        }
      }
      @keyframes drop {
        90% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          -webkit-transform: translateY(100vh);
                  transform: translateY(100vh);
        }
      }
      #cloud {
            width: 200px; height: 50px;
            background: #BFF;
            background: linear-gradient(top, #BFF 5%, #DFF 100%);
            background: -webkit-linear-gradient(top, #FFF 1%, #BFF 100%);
            background: -moz-linear-gradient(top, #BFF 5%, #DFF 100%);
            background: -ms-linear-gradient(top, #BFF 5%, #DFF 100%);
            background: -o-linear-gradient(top, #BFF 5%, #DFF 100%);
            top: 0px; left: 50px;
            border-radius: 100px 0px 0px 100px;
            position: relative;
            margin: 50px auto 20px;
            left:0px;
        }

        #cloud:after, #cloud:before {
            content: '';
            position: absolute;
            background: #FFF;
            z-index: -1
        }

        #cloud:after {
            width: 50px; height: 50px;
            top: -20px; left: 25px;
            border-radius: 100px;
        }

        #cloud:before {
            width: 65px; height: 65px;
            top: -30px; right: 25px;
            border-radius: 200px;
        }
        #cloud2 {
            width: 200px; height: 50px;
            background: #BFF;
            background: linear-gradient(top, #BFF 5%, #DFF 100%);
            background: -webkit-linear-gradient(top, #FFF 1%, #BFF 100%);
            background: -moz-linear-gradient(top, #BFF 5%, #DFF 100%);
            background: -ms-linear-gradient(top, #BFF 5%, #DFF 100%);
            background: -o-linear-gradient(top, #BFF 5%, #DFF 100%);
            top: 0px; left: 50px;
            border-radius: 0px 100px 100px 0px;
            position: relative;
            margin: 50px auto 20px;
            left:0px;
        }

        #cloud2:after, #cloud2:before {
            content: '';
            position: absolute;
            background: #FFF;
            z-index: -1
        }

        #cloud2:after {
            width: 50px; height: 50px;
            top: -20px; left: 25px;
            border-radius: 100px;
        }

        #cloud2:before {
            width: 65px; height: 65px;
            top: -30px; right: 25px;
            border-radius: 200px;
        }
        .shadow {
            width: 260px;
            position: absolute; bottom: -10px; left:15px; 
            background: #000;
            z-index: -1;
            box-shadow: 0 0 20px 8px rgba(0, 0, 0, 0.4);
            border-radius: 50%;
        }
        .shadow1 {
            width: 100px;
            position: absolute; bottom: -10px; left:20%; 
            background: #000;
            z-index: 1;
            box-shadow: 0px 0px 20px 8px rgba(0, 0, 0, 0.4);
            border-radius: 50%;
        }
        #controlluvia{
          max-width: 50px;
        }
        #cloud1 {
            width: 150px; height: 50px;
            background: #BFF;
            background: linear-gradient(top, #BFF 5%, #DFF 100%);
            background: -webkit-linear-gradient(top, #FFF 1%, #BFF 100%);
            background: -moz-linear-gradient(top, #BFF 5%, #DFF 100%);
            background: -ms-linear-gradient(top, #BFF 5%, #DFF 100%);
            background: -o-linear-gradient(top, #BFF 5%, #DFF 100%);
            top: -20px; left: 50px;
            border-radius: 100px;
            position: absolute;
            margin: 50px auto 20px;
            left:28%;
        }

        #cloud1:after, #cloud1:before {
            content: '';
            position: absolute;
            background: #FFF;
            z-index: -1
            
        }
        #cloud1:after {
            width: 50px; height: 50px;
            top: -20px; left: 25px;
            border-radius: 100px;
        }

        #cloud1:before {
            width: 65px; height: 65px;
            top: -30px; right: 25px;
            border-radius: 200px;
        }

        #pronostico {
          position:absolute;
          left: 50%; /* Para centrar horizontalmente */
          transform: translateX(-50%); /* Para centrar horizontalmente */
          top: 40%;
          font-size:140%;
        }
      .rain{
        text-align: center;
        justify-content: center; /* Horizontal centering */
      }
    </style>
  </head>
  <body>
  <div id = "cloud">
      <span class='shadow'></span>
  </div>
  <div id = "cloud2">
      <span class='shadow2'></span>
  </div>
   <div id = "cloud1">
      <span class='shadow1'></span>
  </div>
    <div class="rain">
      <h3 id="pronostico">${contenidos[indice]}</h3>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 27; --y: 47; --o: 0.4683153979227006; --a: 0.8216207474399084; --d: -0.6636435848356403; --s: 0.177490511982332;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 70; --y: 59; --o: 0.8066673178164121; --a: 0.5960250204909101; --d: 0.013867936863348085; --s: 0.17246123657483126;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 82; --y: 50; --o: 0.22590749596419935; --a: 0.8752497257664329; --d: 0.714661481555205; --s: 0.005277124327792038;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 39; --y: 35; --o: 0.8794040530698037; --a: 1.1774572238981884; --d: 0.8757263984103201; --s: 0.5920781842002771;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 0; --y: 23; --o: 0.5194885424076257; --a: 1.1607505188469383; --d: -0.7377250080101372; --s: 0.8402158467450735;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 49; --y: 41; --o: 0.3242361879937361; --a: 1.3838499614685296; --d: 0.03181891638140799; --s: 0.032114795601543955;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 85; --y: 60; --o: 0.09410063589344575; --a: 1.3821130257572583; --d: -0.6027725235436603; --s: 0.30532367394273674;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 51; --y: 93; --o: 0.7707739666098994; --a: 1.0699466147541945; --d: -0.309413897934089; --s: 0.2780391642023874;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 15; --y: 72; --o: 0.35407350010670036; --a: 1.1426197623370138; --d: 0.7716169626294529; --s: 0.17901866676933387;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 84; --y: 49; --o: 0.7622988713411936; --a: 1.4735644197001547; --d: -0.7837207003518762; --s: 0.06430446490911645;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 41; --y: 4; --o: 0.01477508298274377; --a: 0.9368690732142761; --d: 0.9780072133927891; --s: 0.26974270863208716;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 92; --y: 16; --o: 0.6501188737903123; --a: 1.3845075879646118; --d: -0.8686145946259027; --s: 0.739984430288684;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 49; --y: 95; --o: 0.7336061227118635; --a: 1.0629386750355263; --d: 0.4572061461678514; --s: 0.1519148407877955;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 17; --y: 58; --o: 0.3732356879235408; --a: 1.060282262250353; --d: -0.3357378189536453; --s: 0.5433740995119791;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 14; --y: 62; --o: 0.12168319298243757; --a: 1.380677744068666; --d: -0.5593362392776688; --s: 0.8372181724993315;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 63; --y: 90; --o: 0.019951254167448695; --a: 0.8364904768281711; --d: 0.6840933604973629; --s: 0.7221792011198358;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 63; --y: 88; --o: 0.5808244740685606; --a: 1.4688848917981514; --d: -0.32103723817168905; --s: 0.3764956959108017;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 24; --y: 93; --o: 0.4139833123613965; --a: 1.3883778326997247; --d: 0.7812264947316705; --s: 0.3274661690362761;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 39; --y: 64; --o: 0.3492218975222847; --a: 0.7925850999145805; --d: 0.3698229164222502; --s: 0.08310472265051061;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 70; --y: 4; --o: 0.4571209896531869; --a: 0.5955985045877452; --d: 0.7700084596410894; --s: 0.4157546239878209;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 80; --y: 62; --o: 0.23653488477433515; --a: 1.483162921238386; --d: 0.8750919966225905; --s: 0.9045663318956674;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 25; --y: 35; --o: 0.8279002652134149; --a: 0.7610668889505456; --d: -0.51960642975695; --s: 0.6779318834378549;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 54; --y: 24; --o: 0.8539162199052022; --a: 0.6526701163832904; --d: -0.20708165230091957; --s: 0.5088554323579195;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 14; --y: 43; --o: 0.038162036105547914; --a: 1.2177058230134759; --d: -0.1335382903088549; --s: 0.9193918938082029;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 25; --y: 64; --o: 0.14462253467742814; --a: 0.5804450011528437; --d: 0.8631157576145916; --s: 0.11713384423386275;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 79; --y: 50; --o: 0.6873677852788467; --a: 1.2184693339456953; --d: -0.0854653296201775; --s: 0.05302176598404951;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 2; --y: 86; --o: 0.2704597258896344; --a: 0.8569414329970746; --d: 0.5105328252737737; --s: 0.23024542666223846;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 17; --y: 37; --o: 0.8787331196813337; --a: 1.2056573872063703; --d: 0.9831313281548031; --s: 0.16591398559782156;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 0; --y: 90; --o: 0.44911141452204495; --a: 1.0171462437560568; --d: -0.9090385462636505; --s: 0.5940882078452889;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 73; --y: 44; --o: 0.35786063280149416; --a: 0.6935655006775692; --d: -0.18226217969339498; --s: 0.08399776213431753;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 95; --y: 42; --o: 0.6518251000404038; --a: 1.32127298083303; --d: -0.013219108171652838; --s: 0.6767407661801599;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 66; --y: 75; --o: 0.04850425323706009; --a: 1.0641098899817096; --d: -0.496137652089506; --s: 0.43831141299287135;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 23; --y: 40; --o: 0.1909591457010975; --a: 1.113434767009325; --d: -0.3978913119315406; --s: 0.6325308615160499;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 3; --y: 81; --o: 0.8008622029671044; --a: 0.629009990074423; --d: 0.8323409618235802; --s: 0.4488215117771188;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 52; --y: 99; --o: 0.0023737526548839316; --a: 0.8712302004745331; --d: 0.9176985424871194; --s: 0.06872400450882576;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 94; --y: 35; --o: 0.85901694775869; --a: 0.9801120724350003; --d: 0.9131670798048948; --s: 0.2973618219068035;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 29; --y: 32; --o: 0.9244219004762859; --a: 0.8482785105623738; --d: 0.9698794574195291; --s: 0.03405114157434297;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 1; --y: 56; --o: 0.07722194181960673; --a: 0.6454783349447368; --d: 0.7069556531764492; --s: 0.4113363726332584;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 89; --y: 27; --o: 0.675675876117743; --a: 0.8686693557574434; --d: -0.7647566976809239; --s: 0.23248785546659057;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 72; --y: 44; --o: 0.6632862551253107; --a: 1.0982280088301355; --d: -0.970556926751521; --s: 0.5353170726074672;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 82; --y: 83; --o: 0.01518178278907989; --a: 1.2917574792471072; --d: -0.9724450606558261; --s: 0.5291597015476814;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 28; --y: 22; --o: 0.6223924080475702; --a: 1.406054884386459; --d: -0.2087385375703117; --s: 0.2883918040596598;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 45; --y: 70; --o: 0.8604246508304507; --a: 0.6406669966087872; --d: -0.9588236836599799; --s: 0.5255492514951818;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 90; --y: 23; --o: 0.7484951484720348; --a: 1.3584871735370043; --d: -0.5828198629945582; --s: 0.97142113281826;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 30; --y: 59; --o: 0.7575031629745457; --a: 0.9652061680032402; --d: -0.31130148576851324; --s: 0.6527792849448779;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 14; --y: 58; --o: 0.6033452941564863; --a: 1.0664937037774473; --d: 0.5498740198788341; --s: 0.8145695365391543;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 15; --y: 23; --o: 0.8770476519198938; --a: 0.6520547855595431; --d: -0.17701228033927707; --s: 0.07636658670938234;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 18; --y: 82; --o: 0.41681797421740074; --a: 0.9388299921444725; --d: 0.7629759267820209; --s: 0.37165877914838474;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 55; --y: 46; --o: 0.8813501717522798; --a: 1.2914731936259196; --d: -0.41550651013156603; --s: 0.11862011163783448;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 17; --y: 6; --o: 0.2171684559821998; --a: 0.6961623532054055; --d: -0.5480286511961969; --s: 0.052424314675900696;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 59; --y: 65; --o: 0.662118862557803; --a: 0.5946618438244511; --d: 0.6647599681086693; --s: 0.2241090482317225;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 5; --y: 79; --o: 0.47430989056859674; --a: 1.333312678484643; --d: -0.9520946348850319; --s: 0.49981804775282135;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 92; --y: 68; --o: 0.02612212538554215; --a: 0.6266247675680261; --d: -0.2065344989261373; --s: 0.5405083545978473;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 11; --y: 24; --o: 0.9395193842306786; --a: 0.6132164982727508; --d: 0.6578331517957889; --s: 0.5933974232186843;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 89; --y: 52; --o: 0.26748396779114714; --a: 1.1713711512946936; --d: 0.7967047787868387; --s: 0.46377578034062306;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 15; --y: 32; --o: 0.5962003331567434; --a: 1.0516740414712755; --d: 0.2888766987160345; --s: 0.94761393747044;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 25; --y: 97; --o: 0.06436570462727054; --a: 1.1213825298195157; --d: 0.04302502694631327; --s: 0.7195763153233572;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 26; --y: 87; --o: 0.8273054890529545; --a: 0.5391713648511935; --d: -0.06725461905729224; --s: 0.967069690557413;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 72; --y: 0; --o: 0.4065394192115175; --a: 1.1038209143249729; --d: 0.30853970904976125; --s: 0.7307949694791531;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 96; --y: 86; --o: 0.8391098965692032; --a: 1.247176255044272; --d: -0.8176225434835018; --s: 0.6217271346668265;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 79; --y: 14; --o: 0.9686406996894448; --a: 1.4364428803974163; --d: 0.1917327649746503; --s: 0.855839213429985;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 28; --y: 63; --o: 0.1410763033932525; --a: 1.3135319163539005; --d: -0.3251586833522082; --s: 0.37072704395751077;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 62; --y: 22; --o: 0.020419076347431897; --a: 1.0238883167779995; --d: -0.29148939848670086; --s: 0.07068798630830808;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 55; --y: 34; --o: 0.9466612635442313; --a: 0.7792608208429772; --d: 0.3701284176414079; --s: 0.16340336286751644;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 37; --y: 18; --o: 0.7839323990367884; --a: 1.145661755337764; --d: -0.9430760343797786; --s: 0.04875656146077878;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 35; --y: 31; --o: 0.12944581159929403; --a: 0.6319982186136746; --d: 0.5909838185639997; --s: 0.7245591073646591;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 51; --y: 16; --o: 0.7692250503717857; --a: 0.9596393817544213; --d: -0.3238032089547209; --s: 0.6788660953412373;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 77; --y: 30; --o: 0.1745068610674454; --a: 0.8165257203547307; --d: 0.17499230411232558; --s: 0.2273781287165224;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 12; --y: 71; --o: 0.3653489108621726; --a: 1.1408003938056048; --d: 0.4295097137462487; --s: 0.5765073901941826;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 0; --y: 1; --o: 0.4246506011519591; --a: 0.9517389670176639; --d: -0.21819866168215896; --s: 0.7884232841336902;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 7; --y: 13; --o: 0.37585786793737386; --a: 1.279449167421015; --d: 0.6081844367196902; --s: 0.7868708088669738;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 24; --y: 81; --o: 0.8802402094312831; --a: 1.4741390754338883; --d: -0.27001684412841875; --s: 0.8378675516852769;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 30; --y: 34; --o: 0.041454090447870184; --a: 0.5974029650855799; --d: -0.36635511796127584; --s: 0.41459633588778444;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 43; --y: 23; --o: 0.4740737878801269; --a: 0.5350615148309161; --d: 0.4463786562263796; --s: 0.35482298352656083;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 31; --y: 72; --o: 0.1885825209606098; --a: 1.1734287915746202; --d: 0.6473415633644968; --s: 0.4512573542240803;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 58; --y: 55; --o: 0.34764447818801947; --a: 0.8779348985611086; --d: 0.7350628135390043; --s: 0.4824669087910425;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 73; --y: 8; --o: 0.6936700460736198; --a: 1.3193520855929628; --d: -0.2974965034563768; --s: 0.4344296339480658;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 84; --y: 11; --o: 0.021796913599473555; --a: 0.9316099238468061; --d: -0.1385111755918369; --s: 0.3962530369325219;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 87; --y: 21; --o: 0.11649024105071493; --a: 0.6848372255867823; --d: 0.4511095390148472; --s: 0.3711654888037672;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 81; --y: 55; --o: 0.16765778815100818; --a: 0.6858008542330518; --d: 0.5897249710074393; --s: 0.34593424032921183;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 59; --y: 63; --o: 0.060466910310109645; --a: 1.2503816398520997; --d: 0.8397474625362444; --s: 0.6404903570999212;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 23; --y: 77; --o: 0.41800410571265556; --a: 0.9955314174858307; --d: 0.6458565662108517; --s: 0.46056888699201837;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 95; --y: 8; --o: 0.5668020772194484; --a: 0.7137052652289426; --d: 0.7303851794622838; --s: 0.513370085806717;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 85; --y: 39; --o: 0.23521083773752305; --a: 0.8857310097112336; --d: 0.17936033800986761; --s: 0.5117817480610898;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 31; --y: 75; --o: 0.9633206612352223; --a: 0.7321193274400704; --d: 0.3330280221312636; --s: 0.9598398744751953;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 12; --y: 49; --o: 0.8354665687389884; --a: 1.1246390585119166; --d: -0.3410072044325947; --s: 0.9149214185483163;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 76; --y: 19; --o: 0.6991327139778796; --a: 0.5623957573397589; --d: -0.14639072096826045; --s: 0.23157624618510853;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 88; --y: 76; --o: 0.05142214059369121; --a: 0.9478772568132634; --d: -0.8627804684719802; --s: 0.30601122110701606;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 1; --y: 64; --o: 0.8644265522077459; --a: 0.9804226170240855; --d: 0.10343698648937627; --s: 0.6719346473728729;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 49; --y: 97; --o: 0.9413872321104573; --a: 0.635915776028376; --d: 0.3876069520222729; --s: 0.8652794728200741;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 16; --y: 66; --o: 0.31083128433845153; --a: 0.6561393452872162; --d: 0.2194807422269176; --s: 0.21428365130185956;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 29; --y: 86; --o: 0.3905372566095968; --a: 0.9279125723617634; --d: 0.3737529829621473; --s: 0.1261274675290176;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 6; --y: 23; --o: 0.12840426496365565; --a: 0.5349872201644372; --d: 0.04640428522340967; --s: 0.8515129485039767;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 94; --y: 88; --o: 0.8570482471767986; --a: 1.4535790453510262; --d: -0.4047996072701596; --s: 0.6127292089691501;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 99; --y: 48; --o: 0.6735277369363559; --a: 0.5338526814348816; --d: 0.11872700970300576; --s: 0.5740552048335428;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 48; --y: 66; --o: 0.6686376861776147; --a: 1.1586166748802895; --d: 0.8804972050890676; --s: 0.28026987592025243;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 95; --y: 31; --o: 0.2254598761231399; --a: 1.1950881216683775; --d: -0.8965915390479111; --s: 0.9992369725379602;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 94; --y: 36; --o: 0.18986292122626902; --a: 0.6916479303790763; --d: -0.6999284848654521; --s: 0.7474886962373268;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 26; --y: 19; --o: 0.4706771419337408; --a: 0.8452364292571755; --d: -0.22148865114484328; --s: 0.6633119071083973;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 62; --y: 57; --o: 0.9359903170583121; --a: 0.5074886668087151; --d: -0.3994892512774979; --s: 0.22668450660529404;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 60; --y: 93; --o: 0.10442405484742712; --a: 1.2437279616842145; --d: -0.047228845610196135; --s: 0.39800568039074946;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 77; --y: 62; --o: 0.15246620900577845; --a: 0.724771230741371; --d: 0.5072359726165279; --s: 0.6212054967776235;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 73; --y: 78; --o: 0.7528392914982553; --a: 0.6617376953929894; --d: -0.18494069431428128; --s: 0.30292749997342017;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 4; --y: 35; --o: 0.7590449543143603; --a: 1.4885975589110205; --d: 0.10241906563329994; --s: 0.9112636564532346;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 39; --y: 23; --o: 0.39126720866756615; --a: 0.7302285890636537; --d: -0.6085733354548353; --s: 0.6706822679186013;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 41; --y: 97; --o: 0.5740290896720173; --a: 0.8081075124510946; --d: -0.4573050500881468; --s: 0.1727713531247368;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 91; --y: 13; --o: 0.6485108657689393; --a: 1.15229190991609; --d: 0.5540100988640866; --s: 0.6519814464211782;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 89; --y: 38; --o: 0.29590103646316157; --a: 1.4232253749900283; --d: 0.8544111948190141; --s: 0.36601309325157483;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 72; --y: 58; --o: 0.225341569284762; --a: 0.6581544304039353; --d: 0.2206753622019284; --s: 0.9842260255058941;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 45; --y: 80; --o: 0.26480865407479603; --a: 0.7389155254021103; --d: -0.49744314077506724; --s: 0.6868935612185827;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 93; --y: 46; --o: 0.00206739844792847; --a: 0.9587821975891038; --d: -0.7521485292377434; --s: 0.5840150114553089;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 41; --y: 46; --o: 0.8778105970166263; --a: 0.9787697700547426; --d: 0.499940430595748; --s: 0.43884226177987085;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 43; --y: 8; --o: 0.6998668662882945; --a: 0.7569039933450405; --d: -0.6152992808941531; --s: 0.4246667755349165;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 87; --y: 79; --o: 0.7380454049698368; --a: 0.6834794697003743; --d: -0.1696672511749373; --s: 0.4044106170613535;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 92; --y: 26; --o: 0.47217796060118067; --a: 0.976911338988633; --d: -0.4669217403949979; --s: 0.771276114216469;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 13; --y: 53; --o: 0.015388686682993313; --a: 1.0083658739138615; --d: 0.1454420269342287; --s: 0.984268536442994;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 0; --y: 66; --o: 0.7597795028977894; --a: 0.594414763557032; --d: 0.6933140951239429; --s: 0.32444348717278415;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 59; --y: 0; --o: 0.9729505092003132; --a: 1.4430497931321382; --d: -0.7787148764622192; --s: 0.43103343405692573;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 53; --y: 89; --o: 0.43930007351478606; --a: 1.4511871813725337; --d: 0.40511922555122215; --s: 0.1557068114774749;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 54; --y: 25; --o: 0.5333279686653534; --a: 0.9930554287302471; --d: -0.3682585596822623; --s: 0.825156330060741;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 88; --y: 37; --o: 0.7199819359579396; --a: 1.4935519875468852; --d: 0.38241695517710506; --s: 0.603898028005101;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 45; --y: 67; --o: 0.2808978075913058; --a: 1.1519166591174248; --d: 0.9882450396627465; --s: 0.047430435542256566;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 84; --y: 56; --o: 0.02131346457015959; --a: 0.6864658275010314; --d: -0.5021080771037325; --s: 0.7443233349133893;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 72; --y: 6; --o: 0.9177587342821378; --a: 0.8935066014089017; --d: 0.4686158203593451; --s: 0.35738820034549557;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 55; --y: 2; --o: 0.5991560297829868; --a: 1.0652684039783988; --d: -0.24977507273254496; --s: 0.9093121404201179;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 67; --y: 17; --o: 0.000040236460094433824; --a: 1.1945747855997495; --d: -0.6793685920740735; --s: 0.3614670952311192;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 10; --y: 25; --o: 0.5335056567211456; --a: 1.3221602554308645; --d: -0.3111374352365486; --s: 0.41390513052525635;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 86; --y: 54; --o: 0.9879780411775216; --a: 1.2903941189872468; --d: -0.18747320889227082; --s: 0.6446111236342158;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 62; --y: 19; --o: 0.6756289298097029; --a: 0.8495388960989545; --d: 0.4722309801693383; --s: 0.39884227657515714;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 44; --y: 64; --o: 0.4010755646231592; --a: 1.4667388451289949; --d: -0.7859154839842577; --s: 0.9035898499622688;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 18; --y: 31; --o: 0.9263367117240437; --a: 1.0939454012383159; --d: 0.22420738041637644; --s: 0.510459127871264;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 70; --y: 29; --o: 0.8781124466413228; --a: 0.604980196078456; --d: -0.05076324606154525; --s: 0.9642587404359015;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 71; --y: 49; --o: 0.6125632919370694; --a: 1.1650077454971557; --d: 0.9446229469194374; --s: 0.7955688952913207;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 64; --y: 12; --o: 0.1729087424912752; --a: 0.5160024204767664; --d: -0.4454461497933595; --s: 0.8894226110172732;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 93; --y: 82; --o: 0.44260160006796134; --a: 0.7684118629267536; --d: 0.4521285408689919; --s: 0.05124615899685847;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 46; --y: 58; --o: 0.14806875803527442; --a: 0.8763853092694469; --d: -0.8665041134978217; --s: 0.3046112343283043;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 46; --y: 14; --o: 0.9306987225561427; --a: 1.3404265788102057; --d: -0.10585277239804736; --s: 0.7712979764451322;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 90; --y: 59; --o: 0.4576013135377961; --a: 0.7445214778980913; --d: -0.01990360877880404; --s: 0.6907863557503884;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 57; --y: 98; --o: 0.7206537501279364; --a: 0.8348926410861135; --d: -0.3331301877158519; --s: 0.6060848961498808;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 25; --y: 76; --o: 0.2218815959425875; --a: 0.5329675614519331; --d: -0.02485554253456268; --s: 0.914555385012932;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 90; --y: 99; --o: 0.0979396175904983; --a: 0.851247041879283; --d: -0.496298789509964; --s: 0.9748482555691025;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 44; --y: 76; --o: 0.1757610585310081; --a: 0.533269274417558; --d: 0.6975164387362893; --s: 0.09235450923825828;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 48; --y: 83; --o: 0.8713661977696023; --a: 0.9349307296866538; --d: 0.09832578602044428; --s: 0.4885421538838719;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 60; --y: 69; --o: 0.9813673274910877; --a: 1.0756916827199081; --d: 0.1120776888087649; --s: 0.512234046170789;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 96; --y: 92; --o: 0.16223707270037835; --a: 1.158837606588326; --d: -0.34496478459283786; --s: 0.5504102071690098;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 25; --y: 55; --o: 0.5818670206584873; --a: 1.435828323898244; --d: 0.42734212971239005; --s: 0.054350177191028415;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 65; --y: 0; --o: 0.7839813686223869; --a: 0.5144232264551969; --d: -0.4921024944612533; --s: 0.5982882807052083;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 90; --y: 18; --o: 0.8906464785027368; --a: 0.7454857772787449; --d: 0.5964465350898389; --s: 0.9585201776964618;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 45; --y: 16; --o: 0.14190977622523993; --a: 0.8466058178249818; --d: -0.7948018156071481; --s: 0.42339069601435764;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 28; --y: 68; --o: 0.33768125636010793; --a: 1.1360817375229622; --d: -0.6622355285812764; --s: 0.11706192237418267;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 21; --y: 51; --o: 0.6449419338091482; --a: 1.1345737595700134; --d: -0.28008714754972175; --s: 0.7655728150450398;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 15; --y: 90; --o: 0.9133285475271822; --a: 0.6182719547779463; --d: -0.5298040400669191; --s: 0.33977227871072824;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 49; --y: 41; --o: 0.6291663308389344; --a: 1.0362179586231908; --d: 0.5682003208721955; --s: 0.4477923155609027;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 72; --y: 29; --o: 0.4259792115895993; --a: 0.8984771076996751; --d: 0.5126986007035113; --s: 0.905063301355614;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 80; --y: 23; --o: 0.31757982076479196; --a: 1.0193600550984743; --d: -0.27260886818334784; --s: 0.33850616928222066;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 75; --y: 54; --o: 0.4248751581053696; --a: 1.4537259430344558; --d: 0.6096981381166207; --s: 0.9830088324590502;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 21; --y: 35; --o: 0.7244149257415529; --a: 0.9775570158699334; --d: -0.7144096123658299; --s: 0.024136703874156673;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 23; --y: 51; --o: 0.3288580087958519; --a: 0.7640825003903584; --d: 0.685377538264571; --s: 0.163525312200562;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 31; --y: 57; --o: 0.9793973233751665; --a: 0.8640922556920274; --d: -0.09545258780223698; --s: 0.9930369634142764;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 80; --y: 53; --o: 0.363088048116079; --a: 1.182457924638391; --d: -0.8794093158458565; --s: 0.6263951070162439;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 70; --y: 88; --o: 0.26252330428364523; --a: 1.4398644356317498; --d: 0.2142575166758034; --s: 0.838628499430913;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 67; --y: 14; --o: 0.7769931924881712; --a: 1.3489805734392897; --d: -0.6924390263087128; --s: 0.660038392497623;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 74; --y: 43; --o: 0.3048494590046331; --a: 0.772368477931149; --d: 0.4880306029395074; --s: 0.4457625792478799;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 21; --y: 14; --o: 0.1273843335099909; --a: 1.272380084051432; --d: -0.4257567705124359; --s: 0.04910713464859251;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 10; --y: 27; --o: 0.9355383750277178; --a: 1.0553933559686874; --d: 0.6020278151781464; --s: 0.6606888668679529;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 55; --y: 45; --o: 0.45685941492697735; --a: 0.6050006289390255; --d: 0.31205100742433967; --s: 0.2982730797009119;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 50; --y: 41; --o: 0.43776030561938994; --a: 0.7791610198068211; --d: -0.7659089168855862; --s: 0.46169223482310384;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 45; --y: 10; --o: 0.6410461403915064; --a: 1.081146617008835; --d: 0.9418763595854229; --s: 0.43139445881850125;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 4; --y: 70; --o: 0.0216384812947108; --a: 1.0525162495425031; --d: -0.521281311531109; --s: 0.6361621706397298;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 21; --y: 46; --o: 0.06953982294442507; --a: 1.4858525518548145; --d: -0.1812120625838185; --s: 0.8838995056751784;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 92; --y: 87; --o: 0.5445318851457306; --a: 0.5560175646835721; --d: -0.6953490638995263; --s: 0.25767414708227676;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 17; --y: 27; --o: 0.2697115163154211; --a: 0.8929208997700826; --d: 0.7101650195949345; --s: 0.797061139013215;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 16; --y: 94; --o: 0.3138087431987564; --a: 1.4603799987312767; --d: -0.6152270838543301; --s: 0.49996611261837165;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 6; --y: 43; --o: 0.958718364132892; --a: 0.5485419736748824; --d: 0.15024648068567226; --s: 0.5776029883636256;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 71; --y: 87; --o: 0.4206228273168524; --a: 1.0197193847669945; --d: -0.6381648174090264; --s: 0.10766430982675335;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 98; --y: 61; --o: 0.616079686538656; --a: 0.9241688757154232; --d: 0.9123733098747326; --s: 0.6405996361880333;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 73; --y: 97; --o: 0.9680662982389696; --a: 1.2802706706379023; --d: 0.19260207637796078; --s: 0.8457222616299331;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 97; --y: 54; --o: 0.796479549864828; --a: 0.9899572420638811; --d: 0.03662948518419551; --s: 0.9576821387586618;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 49; --y: 72; --o: 0.08134422593968837; --a: 0.768081654532359; --d: -0.15771979490102472; --s: 0.22442425327040016;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 32; --y: 38; --o: 0.1492171390565329; --a: 1.242063161107034; --d: 0.3408604118953411; --s: 0.8216192442980705;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 63; --y: 92; --o: 0.8796866748009775; --a: 1.452597975388428; --d: -0.4813323931233735; --s: 0.4782658447517969;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 9; --y: 22; --o: 0.2649156312436871; --a: 0.846400754443988; --d: 0.734963600929385; --s: 0.39551602489924687;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 56; --y: 9; --o: 0.5135461188539256; --a: 0.6704593528313096; --d: -0.7577882485188034; --s: 0.06422199533552986;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 55; --y: 63; --o: 0.48577181306647255; --a: 0.5932084061599929; --d: -0.07640573592140099; --s: 0.04432134830178969;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 15; --y: 95; --o: 0.9968530148642183; --a: 1.4925479838247335; --d: -0.98333000855787; --s: 0.4895469552851419;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 58; --y: 77; --o: 0.3322459486228966; --a: 0.7831718738056246; --d: 0.3745590918784165; --s: 0.4288579869420215;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 74; --y: 25; --o: 0.4323788365466694; --a: 1.3666444957298334; --d: 0.9090851016252341; --s: 0.5143751698461525;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 93; --y: 19; --o: 0.23319923598016112; --a: 1.0301556058180135; --d: -0.6134410971420179; --s: 0.9978896722740129;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 56; --y: 19; --o: 0.21287853496726283; --a: 1.148057893565128; --d: -0.8749650683265808; --s: 0.934591216339399;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 44; --y: 40; --o: 0.5436866962347915; --a: 0.8351437702439759; --d: 0.04621776478210782; --s: 0.7608569948468171;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 15; --y: 66; --o: 0.009706086588290086; --a: 0.6425572096678915; --d: 0.5056893590109262; --s: 0.6593937035844994;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 38; --y: 41; --o: 0.7322705029622691; --a: 0.895579110871308; --d: 0.8718796238939488; --s: 0.5386754289421205;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 99; --y: 32; --o: 0.4191541408660875; --a: 0.8908822971512638; --d: -0.1908761478983605; --s: 0.7479231045406378;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 75; --y: 34; --o: 0.5888423923005734; --a: 1.068589605463913; --d: 0.7917852126129623; --s: 0.1521816636149791;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 83; --y: 42; --o: 0.2141920990330446; --a: 0.8846154482600892; --d: -0.15843004071266842; --s: 0.09460950734302864;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 29; --y: 23; --o: 0.5401505205567882; --a: 0.8231242766355515; --d: -0.5155182117737866; --s: 0.25032152825973264;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 15; --y: 31; --o: 0.7818619898947397; --a: 0.7271486089228236; --d: 0.288681349708122; --s: 0.33673975285130964;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 98; --y: 90; --o: 0.8076270614467829; --a: 0.7568396817325107; --d: 0.4332447577773535; --s: 0.14126072200722062;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 3; --y: 92; --o: 0.31697031334579906; --a: 1.0769336438618808; --d: 0.8000479088605355; --s: 0.2964674524035098;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 92; --y: 25; --o: 0.6057278170395763; --a: 0.6683891946133051; --d: 0.8539613161909361; --s: 0.29830676784446086;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 84; --y: 48; --o: 0.4855648125297436; --a: 0.9742566938501034; --d: -0.8009421561159238; --s: 0.7396819429880241;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 24; --y: 90; --o: 0.28544886410051307; --a: 1.1899958928723258; --d: -0.3345309080365739; --s: 0.535342028600748;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 4; --y: 99; --o: 0.016916030434700913; --a: 1.4974050553130944; --d: 0.5289984277594346; --s: 0.8796629746543765;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 98; --y: 18; --o: 0.7964536098567538; --a: 0.8709894100246318; --d: 0.915975421796916; --s: 0.06936415751632619;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 39; --y: 5; --o: 0.7472936917825899; --a: 1.341121601443693; --d: 0.4267792391969305; --s: 0.8589008720952109;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 48; --y: 50; --o: 0.4974703209119946; --a: 0.5090142473953987; --d: 0.3751799585922684; --s: 0.11903425128999023;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 72; --y: 99; --o: 0.13435070452511733; --a: 0.7908823001459089; --d: -0.3496517583948058; --s: 0.07622981573899756;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 58; --y: 11; --o: 0.8611416023420364; --a: 1.2790849242653175; --d: -0.020047569244470598; --s: 0.34851990786737064;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 15; --y: 17; --o: 0.8710479532990143; --a: 1.3968830212856098; --d: 0.3455990770392692; --s: 0.39264824107894203;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 66; --y: 79; --o: 0.5950444913491895; --a: 0.9479291590759011; --d: 0.6949701775268506; --s: 0.2060215020941456;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 21; --y: 39; --o: 0.6277843652058515; --a: 0.7078108721977296; --d: -0.6967080353374278; --s: 0.9046857303330893;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 66; --y: 75; --o: 0.02832298693042734; --a: 1.4209501953331123; --d: 0.5545552172428168; --s: 0.5854718353832866;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 71; --y: 23; --o: 0.3059807745283625; --a: 1.2739965568229608; --d: 0.7979609667668961; --s: 0.6984686643909515;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 49; --y: 88; --o: 0.24913378103381145; --a: 1.2821863988465887; --d: -0.01555167700107507; --s: 0.9093302930536744;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 65; --y: 32; --o: 0.9786348382020345; --a: 1.1613122259781608; --d: 0.5168432164202974; --s: 0.02439396703757124;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 11; --y: 75; --o: 0.598810705073139; --a: 1.0541611717767054; --d: 0.056386846705385185; --s: 0.48934739441021113;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 2; --y: 48; --o: 0.0745391139682745; --a: 1.3007915779781778; --d: 0.2624760861978688; --s: 0.2576831790789633;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 41; --y: 45; --o: 0.37660473298468533; --a: 1.3507494676659064; --d: 0.6877311185392507; --s: 0.6316538604318449;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 34; --y: 44; --o: 0.17547870107131036; --a: 0.8636746423176498; --d: -0.22065256330658878; --s: 0.6286839983241663;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 21; --y: 83; --o: 0.18315754024134545; --a: 0.6404752548428192; --d: 0.2407466357309649; --s: 0.21953374384228508;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 77; --y: 90; --o: 0.8486491405313468; --a: 1.0594066015532329; --d: 0.3794455294476542; --s: 0.9845649915087251;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 30; --y: 8; --o: 0.8840040836315537; --a: 1.309683945389478; --d: -0.28847540346647316; --s: 0.3137192447245749;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 90; --y: 97; --o: 0.3790339762020658; --a: 1.066055421512522; --d: 0.6782133944164799; --s: 0.9385219469630361;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 65; --y: 55; --o: 0.17690568808190466; --a: 0.7336410546155148; --d: 0.5064007847972842; --s: 0.5337317528838135;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 81; --y: 80; --o: 0.06359375183244964; --a: 0.5134304602789104; --d: -0.6972176526102158; --s: 0.3846093750406647;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 4; --y: 58; --o: 0.3382825608421347; --a: 1.4593792211753112; --d: 0.08321098392011184; --s: 0.5934151303180948;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 29; --y: 94; --o: 0.203801578293491; --a: 1.028981120091336; --d: 0.5571967252379997; --s: 0.00658860876612799;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 29; --y: 69; --o: 0.9512157490248714; --a: 1.190187327675236; --d: 0.3520135714065247; --s: 0.9388378774337487;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 43; --y: 30; --o: 0.9325116634112425; --a: 1.4291837579707576; --d: -0.6433755915997095; --s: 0.39465399340276774;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 99; --y: 25; --o: 0.16913957362594112; --a: 0.7717803924059741; --d: 0.979456085250535; --s: 0.4795561740354133;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 98; --y: 88; --o: 0.6641137249053928; --a: 1.4279532011740543; --d: -0.3222896892617375; --s: 0.7375841177480205;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 46; --y: 89; --o: 0.7006780127150858; --a: 1.2154643394741578; --d: 0.6362557011010512; --s: 0.537202946780629;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 51; --y: 83; --o: 0.29998363208427836; --a: 1.466060570044934; --d: -0.19627169017336632; --s: 0.8758734993577468;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 23; --y: 38; --o: 0.6852021155809291; --a: 1.2782772824880897; --d: 0.48665209684577704; --s: 0.5294028515663656;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 93; --y: 71; --o: 0.9841419024732834; --a: 1.0442381828151934; --d: -0.1127097595561577; --s: 0.2306047388285566;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 8; --y: 59; --o: 0.9649921014543399; --a: 0.9234296141095919; --d: -0.5958517409482336; --s: 0.6052864516002581;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 59; --y: 9; --o: 0.4680316413474943; --a: 1.1278301252921628; --d: -0.9133038851973327; --s: 0.5875639011126277;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 29; --y: 18; --o: 0.8750659844152824; --a: 1.1356856134743174; --d: -0.6942745693005121; --s: 0.8832237010446427;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 61; --y: 9; --o: 0.16014011309887954; --a: 0.9717803335341746; --d: -0.1849970292159111; --s: 0.45450715944389497;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 92; --y: 80; --o: 0.3505586952915798; --a: 0.902111285435593; --d: -0.38489903327248554; --s: 0.30052499689239176;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 39; --y: 77; --o: 0.1754542054910424; --a: 0.9483675490180408; --d: -0.158899972638618; --s: 0.5146071439891866;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 67; --y: 86; --o: 0.2858289741601798; --a: 0.7064439805828535; --d: 0.7324222626253984; --s: 0.9159493462109134;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 77; --y: 34; --o: 0.09881788925488921; --a: 1.2595080790868982; --d: -0.2113509775913256; --s: 0.5187444846693512;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 9; --y: 53; --o: 0.3593985750436557; --a: 0.5741234748024364; --d: -0.16219350158162316; --s: 0.31950761753162316;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 20; --y: 22; --o: 0.4839307617259825; --a: 0.6828553001430495; --d: 0.5884544862430015; --s: 0.17787554215228218;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 41; --y: 72; --o: 0.2264784468771186; --a: 1.1256936954510026; --d: 0.8247061822066781; --s: 0.44500305889427394;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 30; --y: 25; --o: 0.13483264248433446; --a: 0.8879628196894107; --d: -0.00005906990604653828; --s: 0.3943390214643667;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 60; --y: 30; --o: 0.8970054629102941; --a: 1.1573430302084455; --d: 0.5532182559053589; --s: 0.808468654983721;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 52; --y: 67; --o: 0.7704286499978559; --a: 0.6778837759435445; --d: -0.10678324577889686; --s: 0.4921728531517291;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
      <svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 54; --y: 98; --o: 0.5061788489764649; --a: 0.7573548833270574; --d: 0.8926110735323198; --s: 0.389275528499186;">
        <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
      </svg>
  </div>
  </body>
  </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: chartHtml }}
        style={{ width:300, height: 300, backgroundColor: 'transparent'}}
        pointerEvents="none"
      />
      <Pressable style={styles.button} onPress={traerdatos}>
        {loading 
          ?<ActivityIndicator color="#fff" />
          :<Text style={globalStyles.text}><Icon name="sync-alt" size={20} color="#FFFF" /> Actualizar</Text>
        }
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop:10,
  },
});
export default Rain;
