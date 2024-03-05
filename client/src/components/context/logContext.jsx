import React, { createContext, useReducer, useContext } from 'react';

// Initial state tanımı
const initialState = {
  logData: [], // veri tabanından çekilen loglar burada saklanacak
  selectUserName: "",
};

const ActionTypes = {
  SET_LOG_DATA: 'SET_LOG_DATA',
  SET_SELECTED_USERNAME: 'SET_SELECTED_USERNAME',
};

// Reducer fonksiyonu
function logDataReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOG_DATA:
      return {
        ...state, // spread operatörü ile tüm state kopyalanıyor ve yenisi oluşturuluyor 
        logData: action.payload, // burada fonksşyondan gelen paylaod değeri logData adlı state içine ekleniyor ve sadece bu state güncelleniyor diğer stateler aynı kalıyor
        // ve içindeki veriler her seferinde yeni gelen verilerle değişir çünkü sürekli olarak loglar veri tabanından tümü çekilecek
        
      }
    case ActionTypes.SET_SELECTED_USERNAME:
      return {
        ...state,
        selectUserName: action.payload,
      }
    default:
      return state;
  }
}

// Context ve Provider oluşturma
const LogDataContext = createContext(); // context nesnesi oluşturuluyor

export const LogDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(logDataReducer, initialState); // oluşturulan initial state içindeki statelere yapılacak olan işlemler burada birleştiriliyor hangi işlemler yapılacaksa switch case yapısında

  return (
    <LogDataContext.Provider value={{ state, dispatch }}>
      {children}
    </LogDataContext.Provider>
  );
};

// Custom hook
export const useLogData = () => useContext(LogDataContext);
