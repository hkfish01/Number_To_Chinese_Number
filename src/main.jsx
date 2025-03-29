import React, { useState } from 'react';
    import ReactDOM from 'react-dom/client';

    const CheckNumberConverter = () => {
      const [number, setNumber] = useState('');
      const [chineseAmount, setChineseAmount] = useState('');
      const [decimalPart, setDecimalPart] = useState('');

      const convertToChinese = (num) => {
        const chineseDigits = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
        const chineseUnits = ['', '拾', '佰', '仟'];
        const bigUnits = ['', '萬', '億', '兆'];

        if (num === 0) return '零';

        let result = '';
        let unitPos = 0;
        let needZero = false;

        while (num > 0) {
          const segment = num % 10000;
          if (segment > 0) {
            let segmentStr = '';
            let temp = segment;
            let pos = 0;

            do {
              const digit = temp % 10;
              if (digit !== 0) {
                segmentStr = chineseDigits[digit] + chineseUnits[pos] + segmentStr;
                needZero = false;
              } else if (!needZero && segmentStr !== '') {
                segmentStr = '零' + segmentStr;
                needZero = true;
              }
              temp = Math.floor(temp / 10);
              pos++;
            } while (temp > 0);

            if (unitPos > 0) {
              segmentStr += bigUnits[unitPos];
            }

            result = segmentStr + result;
          } else {
            needZero = true;
          }

          num = Math.floor(num / 10000);
          unitPos++;
        }

        result = result.replace(/零+/g, '零').replace(/零$/, '');
        return result || '零';
      };

      const handleInputChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
          setNumber(value);
          setChineseAmount('');
          setDecimalPart('');
        }
      };

      const handleConvert = () => {
        if (!number) return;

        const num = parseFloat(number);
        if (isNaN(num)) {
          setChineseAmount('請輸入有效數字');
          return;
        }

        // 處理整數部分
        const integerPart = Math.floor(num);
        let chineseInteger = convertToChinese(integerPart) + '元';

        // 處理小數部分
        const decimalValue = Math.round((num - integerPart) * 100);
        let chineseDecimal = '';
        
        if (decimalValue > 0) {
          const jiao = Math.floor(decimalValue / 10);
          const fen = decimalValue % 10;
          
          if (jiao > 0) {
            chineseDecimal += convertToChinese(jiao) + '角';
          }
          if (fen > 0) {
            chineseDecimal += convertToChinese(fen) + '分';
          }
        } else {
          chineseDecimal = '整';
        }

        setChineseAmount(chineseInteger);
        setDecimalPart(chineseDecimal);
      };

      return (
        <div className="container">
          <h1>支票數字轉中文大寫</h1>
          
          <div className="input-group">
            <label htmlFor="number-input">請輸入金額：</label>
            <input
              id="number-input"
              type="text"
              value={number}
              onChange={handleInputChange}
              placeholder="例如：12345.67"
            />
          </div>
          
          <button onClick={handleConvert}>轉換</button>
          
          {chineseAmount && (
            <div className="result">
              <div className="result-title">中文大寫金額：</div>
              <div className="result-content">
                {chineseAmount}{decimalPart}
              </div>
            </div>
          )}
        </div>
      );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<CheckNumberConverter />);
