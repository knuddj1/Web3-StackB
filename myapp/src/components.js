'use strict';

function addToLocalStorage(res){
    let countries = {};
    res.forEach(dset => {
        const dataset_name = dset.dataset_name;
        dset.years.forEach(year => {
            const yearNum = year.year;
            year.countries.forEach(country => {
                const country_name = country.country_name;
                if(country_name in countries){
                    if(yearNum in countries[country_name]){
                        countries[country_name][yearNum][dataset_name] = country.payload;
                    } else{
                        countries[country_name][yearNum] = {dataset_name : country.payload}
                    }
                } else{
                    countries[country_name] = {}

                    if(yearNum in countries[country_name]){
                        countries[country_name][yearNum][dataset_name] = country.payload;
                    } else{
                        countries[country_name][yearNum] = {dataset_name : country.payload}
                    }
                } 
            })
        })
    });
    localStorage.setItem('countries', JSON.stringify(countries));
}


class SelectionBox extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        countries: null,
        selectBoxVal: null,
      };

      this.yearsSlider = React.createRef();
    }
  
    componentDidMount() { 
        if (localStorage.getItem('countries') === null) {
            fetch('http://127.0.0.1/get_dataset')
            .then(res => res.json())
            .then((res) => {
                addToLocalStorage(res);
                const data = JSON.parse(localStorage.getItem('countries'));
                this.setState({
                    isLoaded: true,  
                    countries: data,
                });

            },(error) => {
                this.setState({
                isLoaded: true,
                error
                });
            });
        }
        else{
            const data = JSON.parse(localStorage.getItem('countries'));
            this.setState({
                isLoaded: true, 
                countries: data,
            });
        }
    }
    
    handleChange = () => {
        const sb = document.getElementById('countries-selectbox');
        var val = sb.options[sb.selectedIndex].value;
        this.setState({
            selectBoxVal: val,
        });
        this.yearsSlider.current.handleCountriesChange(val);
    }
  
    render() {
      const { error, isLoaded, countries} = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
            <div className="SelectionBox">
                <div class="component-grid-container">
                    <div class="component-grid-item">
                        <select id="countries-selectbox" onChange={this.handleChange}>
                            {Object.keys(countries).map(country => (
                            <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    <div class="component-grid-item">
                        <YearsSlider ref={this.yearsSlider}/>
                    </div>
                </div>
            </div>
        );
      }
    }
  }

  
class YearsSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            min: 0,
            max: 100,
            value: 0,
        };
    }
    
    handleCountriesChange = (country_name) => {
        const countries = JSON.parse(localStorage.getItem('countries'));
        const years = Object.keys(countries[country_name]);
        const min = Math.min.apply(Math, years)
        this.setState({
            min: min,
            max: Math.max.apply(Math, years),
            value: min,
        });
    }

    updateValue = () => {
        const slider = document.getElementById('years-slider');
        this.setState({
            value: slider.value,
        })
    }

    render(){
        const {min, max, value} = this.state;
        return(
            <div className="YearSlider">
                <input type="range" class="slider" id="years-slider" min={min} max={max} value={value} onChange={this.updateValue}/>
                <p>Year: {value}</p>
            </div>
        );
    }
}


let selectionBox = document.querySelector('#selection-box');
ReactDOM.render(<SelectionBox />, selectionBox);

class TextArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render(){
        return (
            <div className="TextArea">
                <p>PLACEHOLDER DOG</p>
            </div>
        );
    }
}

let textArea = document.querySelector('#text-area');
ReactDOM.render(<TextArea />, textArea);
  