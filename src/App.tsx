import React from 'react';

interface IApp {
  name: string;
  age: number;
}

const obj: IApp = {
  name: 'russdfdfsdf111111sdfdfdslan',
  age: 15,
};
console.log(obj);
const App = (): JSX.Element => {
  return (
    <div>
      {obj.age}
      <h2>Welcome to React App</h2>
      <h3>Date : {new Date().toDateString()}</h3>
    </div>
  );
};

export default App;
