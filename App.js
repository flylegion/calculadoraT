import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as NavigationBar from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { calcularInicial } from './calculoInicial';
import { calcularPuntos } from './calculoPuntos';
import { calcularResultados } from './calculoResultados';
import { generarRondas } from './generarRondas';

function AppContent() {
  const [precio, setPrecio] = useState('');
  const [usd, setUsd] = useState('');
  const [numRondas, setNumRondas] = useState('3');
  const [rondas, setRondas] = useState([]);
  const [resultadosR1, setResultadosR1] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [copiado, setCopiado] = useState(null);

  // 🧱 Configurar UI
  useEffect(() => {
    const configurarUI = async () => {
      try {
        await SystemUI.setBackgroundColorAsync('#121212');  
        await NavigationBar.setBackgroundColorAsync('#121212');
        await NavigationBar.setButtonStyleAsync('light');
        await NavigationBar.setBehaviorAsync('inset-swipe');
        await NavigationBar.setVisibilityAsync('visible');
      } catch (e) {
        console.log('Error configurando UI:', e);
      }
    };
    configurarUI();
  }, []);

  const copiar = (texto, id) => {
    Clipboard.setStringAsync(texto.toString());
    setCopiado(id);
  };

  const handleLongPress = (texto, id) => {
    const idTimeout = setTimeout(() => copiar(texto, id), 500);
    setTimeoutId(idTimeout);
  };

  const handlePressOut = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };

  // ✅ Función para permitir hasta 9 decimales
  const handleDecimalInput = (text, setter) => {
    const regex = /^\d*\.?\d{0,9}$/;
    if (text === '' || regex.test(text)) {
      setter(text);
    }
  };

  const calcular = () => {
    const precioNum = parseFloat(precio) || 0;
    const usdNum = parseFloat(usd) || 0;

    const inicial = calcularInicial(precioNum, usdNum);
    if (!inicial) return;
    const datosR1 = calcularPuntos(inicial);
    const resR1 = calcularResultados(datosR1);
    setResultadosR1({ datos: datosR1, ...resR1 });

    const n = Math.max(1, parseInt(numRondas, 10) || 1);
    const rondasSiguientes =
      n > 1 ? generarRondas(n - 1, resR1.totalUsd, resR1.promedioMinus5) : [];

    setRondas(rondasSiguientes);
  };

  const renderResultados = (datos, rondaId) => (
    <>
      <View style={{ flexDirection: 'row', marginBottom: 6 }}>
        <Text style={{ flex: 1, textAlign: 'left', color: '#9a9a9a', fontSize: 12 }}>%</Text>
        <Text style={{ flex: 1, textAlign: 'right', color: '#9a9a9a', fontSize: 12 }}>Precio</Text>
        <Text style={{ flex: 1, textAlign: 'right', color: '#9a9a9a', fontSize: 12 }}>Coins</Text>
        <Text style={{ flex: 1, textAlign: 'right', color: '#9a9a9a', fontSize: 12 }}>USD</Text>
      </View>

      {datos.map((r, i) => {
        const precioId = `${rondaId}-precio-${i}`;
        const coinsId = `${rondaId}-coins-${i}`;
        const usdId = `${rondaId}-usd-${i}`;

        const estiloBase = { textAlign: 'right', color: '#00b8d4', fontSize: 12 };
        const estiloCopiado = {
          color: '#00ffff',
          opacity: 0.97,
          textShadowColor: '#00eaff',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 26,
          fontWeight: '700',
        };

        return (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              marginBottom: 5,
              backgroundColor: '#181818',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#2a2a2a',
              paddingVertical: 4,
              paddingHorizontal: 6,
            }}
          >
            <Text style={{ flex: 1, textAlign: 'left', color: '#f2f2f2', fontSize: 12 }}>{r.label}</Text>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPressIn={() => handleLongPress(r.precio, precioId)}
              onPressOut={handlePressOut}
            >
              <Text style={[estiloBase, copiado === precioId && estiloCopiado]}>{r.precio}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPressIn={() => handleLongPress(r.coins, coinsId)}
              onPressOut={handlePressOut}
            >
              <Text style={[estiloBase, copiado === coinsId && estiloCopiado]}>{r.coins}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPressIn={() => handleLongPress(r.usd, usdId)}
              onPressOut={handlePressOut}
            >
              <Text style={[estiloBase, copiado === usdId && estiloCopiado]}>${r.usd}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </>
  );

  return (
    <>
      <StatusBar style="light" backgroundColor="#121212" translucent={false} />

      {/* 🔹 Barra superior */}
      <View
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          right: 10,
          zIndex: 10,
          flexDirection: 'row',
          backgroundColor: '#181818',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#2a2a2a',
          padding: 6,
        }}
      >
        <TextInput
          placeholder="Precio"
          placeholderTextColor="#777"
          keyboardType="numeric"
          value={precio}
          onChangeText={(text) => handleDecimalInput(text, setPrecio)}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#2a2a2a',
            backgroundColor: '#121212',
            padding: 6,
            marginRight: 6,
            color: '#f2f2f2',
            borderRadius: 8,
            textAlign: 'center',
            height: 32,
          }}
        />
        <TextInput
          placeholder="USD"
          placeholderTextColor="#777"
          keyboardType="numeric"
          value={usd}
          onChangeText={(text) => handleDecimalInput(text, setUsd)}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#2a2a2a',
            backgroundColor: '#121212',
            padding: 6,
            marginRight: 6,
            color: '#f2f2f2',
            borderRadius: 8,
            textAlign: 'center',
            height: 32,
          }}
        />
        <TextInput
          placeholder="Rondas"
          placeholderTextColor="#777"
          keyboardType="numeric"
          value={numRondas}
          onChangeText={setNumRondas}
          style={{
            width: 60,
            borderWidth: 1,
            borderColor: '#2a2a2a',
            backgroundColor: '#121212',
            padding: 6,
            marginRight: 6,
            color: '#f2f2f2',
            borderRadius: 8,
            textAlign: 'center',
            height: 32,
          }}
        />
        <TouchableOpacity
          onPress={calcular}
          style={{
            backgroundColor: '#00b8d4',
            paddingHorizontal: 12,
            justifyContent: 'center',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#121212', fontWeight: 'bold', fontSize: 12 }}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* 🔸 Contenido */}
      <ScrollView
        style={{ flex: 1, backgroundColor: '#121212' }}
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 40, paddingHorizontal: 20 }}
      >
        {resultadosR1 && (
          <View style={{
              marginBottom: 10,
              backgroundColor: '#181818',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#2a2a2a',
              padding: 10,
            }}>
            <Text style={{ color: '#00b8d4', marginBottom: 10, fontSize: 13, fontWeight: '600' }}>
              Ronda 1:
            </Text>
            {renderResultados(resultadosR1.datos, 'r1')}
            <View style={{ borderTopWidth: 1, borderColor: '#2a2a2a', marginVertical: 6 }} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ flex: 2 }} />
              <Text style={{ flex: 1, textAlign: 'right', color: '#4fff8f' }}>
                {parseFloat(resultadosR1.totalCoins).toFixed(9)}
              </Text>
              <Text style={{ flex: 1, textAlign: 'right', color: '#4fff8f' }}>
                ${parseFloat(resultadosR1.totalUsd).toFixed(2)}
              </Text>
            </View>
            <Text style={{ marginTop: 6, color: '#aaa', fontStyle: 'italic', textAlign: 'left', fontSize: 11 }}>
              Promedio: <Text style={{ color: '#ff66c4' }}>{parseFloat(resultadosR1.promedio).toFixed(9)}</Text> | −5%: <Text style={{ color: '#ff66c4' }}>{parseFloat(resultadosR1.promedioMinus5).toFixed(9)}</Text>
            </Text>
          </View>
        )}

        {rondas.map((ronda, idx) => (
          <View key={idx} style={{
              marginBottom: 10,
              backgroundColor: '#181818',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#2a2a2a',
              padding: 10,
            }}>
            <Text style={{ color: '#00b8d4', marginBottom: 10, fontSize: 13, fontWeight: '600' }}>
              Ronda {ronda.ronda}:
            </Text>
            {renderResultados(ronda.datos, `r${idx + 2}`)}
            <View style={{ borderTopWidth: 1, borderColor: '#2a2a2a', marginVertical: 6 }} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ flex: 2 }} />
              <Text style={{ flex: 1, textAlign: 'right', color: '#4fff8f' }}>
                {parseFloat(ronda.totalCoins).toFixed(9)}
              </Text>
              <Text style={{ flex: 1, textAlign: 'right', color: '#4fff8f' }}>
                ${parseFloat(ronda.totalUsd).toFixed(2)}
              </Text>
            </View>
            <Text style={{ marginTop: 6, color: '#aaa', fontStyle: 'italic', textAlign: 'left', fontSize: 11 }}>
              Promedio: <Text style={{ color: '#ff66c4' }}>{parseFloat(ronda.promedio).toFixed(9)}</Text> | −5%: <Text style={{ color: '#ff66c4' }}>{parseFloat(ronda.promedioMenos5).toFixed(9)}</Text>
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* 🧱 Fondo gesture bar */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 30,
          backgroundColor: '#121212',
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
    }
