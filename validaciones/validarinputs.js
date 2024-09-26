// validations.js
export const validarvacios = (fields) => {
    for (const field in fields) {
      if (!fields[field]) {
        return false;
      }
    }
    return true;
};
  
export const handleCedulaChange = (text, setCedula, setError) => {
    if (/^\d*$/.test(text)) {
        setCedula(text);
        const errorMessage = validateCedula(text);
        setError(errorMessage);
    }
};
  
export const validateCedula = (cedula) => {
    if (cedula.length !== 10) {
        return '❌ Esta cédula tiene menos de 10 Dígitos';
    }

    if (cedula == '2222222222') {
        return '❌ Esta cédula es incorrecta'; 
    }

    const digito_region = cedula.substring(0, 2);
    if (digito_region < 1 || digito_region > 24) {
        return '❌ Esta cédula no pertenece a ninguna región';
    }

    const ultimo_digito = parseInt(cedula.substring(9, 10), 10);
    const pares = parseInt(cedula.substring(1, 2), 10) +
                    parseInt(cedula.substring(3, 4), 10) +
                    parseInt(cedula.substring(5, 6), 10) +
                    parseInt(cedula.substring(7, 8), 10);

    const calcularImpar = (numero) => {
        let resultado = numero * 2;
        return resultado > 9 ? resultado - 9 : resultado;
    };

    const impares = calcularImpar(parseInt(cedula.substring(0, 1), 10)) +
                    calcularImpar(parseInt(cedula.substring(2, 3), 10)) +
                    calcularImpar(parseInt(cedula.substring(4, 5), 10)) +
                    calcularImpar(parseInt(cedula.substring(6, 7), 10)) +
                    calcularImpar(parseInt(cedula.substring(8, 9), 10));

    const suma_total = pares + impares;
    const primer_digito_suma = parseInt(String(suma_total).substring(0, 1), 10);
    const decena = (primer_digito_suma + 1) * 10;
    const digito_validador = decena - suma_total === 10 ? 0 : decena - suma_total;

    return digito_validador === ultimo_digito ? null : '❌ Cédula incorrecta';
};

export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
    if (!passwordRegex.test(password)) {
      return '❌ La contraseña debe tener entre 6 y 10 caracteres, incluir al menos una letra mayúscula, una letra minúscula, un número, un carácter especial y no debe tener espacios.';
    }
    return null;
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return '❌ Correo electrónico no válido';
    }
    return null;
};