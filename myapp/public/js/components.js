'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function addToLocalStorage(res) {
    var countries = {};
    res.forEach(function (dset) {
        var dataset_name = dset.dataset_name;
        dset.years.forEach(function (year) {
            var yearNum = year.year;
            year.countries.forEach(function (country) {
                var country_name = country.country_name;
                if (country_name in countries) {
                    if (yearNum in countries[country_name]) {
                        countries[country_name][yearNum][dataset_name] = country.payload;
                    } else {
                        countries[country_name][yearNum] = { dataset_name: country.payload };
                    }
                } else {
                    countries[country_name] = {};

                    if (yearNum in countries[country_name]) {
                        countries[country_name][yearNum][dataset_name] = country.payload;
                    } else {
                        countries[country_name][yearNum] = { dataset_name: country.payload };
                    }
                }
            });
        });
    });
    localStorage.setItem('countries', JSON.stringify(countries));
}

var SelectionBox = function (_React$Component) {
    _inherits(SelectionBox, _React$Component);

    function SelectionBox(props) {
        _classCallCheck(this, SelectionBox);

        var _this = _possibleConstructorReturn(this, (SelectionBox.__proto__ || Object.getPrototypeOf(SelectionBox)).call(this, props));

        _this.handleChange = function () {
            var sb = document.getElementById('countries-selectbox');
            var val = sb.options[sb.selectedIndex].value;
            _this.setState({
                selectBoxVal: val
            });
            _this.yearsSlider.current.handleCountriesChange(val);
        };

        _this.state = {
            error: null,
            isLoaded: false,
            countries: null,
            selectBoxVal: null
        };

        _this.yearsSlider = React.createRef();
        return _this;
    }

    _createClass(SelectionBox, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            if (localStorage.getItem('countries') === null) {
                fetch('http://127.0.0.1/get_dataset').then(function (res) {
                    return res.json();
                }).then(function (res) {
                    addToLocalStorage(res);
                    var data = JSON.parse(localStorage.getItem('countries'));
                    _this2.setState({
                        isLoaded: true,
                        countries: data
                    });
                }, function (error) {
                    _this2.setState({
                        isLoaded: true,
                        error: error
                    });
                });
            } else {
                var data = JSON.parse(localStorage.getItem('countries'));
                this.setState({
                    isLoaded: true,
                    countries: data
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                error = _state.error,
                isLoaded = _state.isLoaded,
                countries = _state.countries;

            if (error) {
                return React.createElement(
                    'div',
                    null,
                    'Error: ',
                    error.message
                );
            } else if (!isLoaded) {
                return React.createElement(
                    'div',
                    null,
                    'Loading...'
                );
            } else {
                return React.createElement(
                    'div',
                    { className: 'SelectionBox' },
                    React.createElement(
                        'div',
                        { 'class': 'component-grid-container' },
                        React.createElement(
                            'div',
                            { 'class': 'component-grid-item' },
                            React.createElement(
                                'select',
                                { id: 'countries-selectbox', onChange: this.handleChange },
                                Object.keys(countries).map(function (country) {
                                    return React.createElement(
                                        'option',
                                        { key: country, value: country },
                                        country
                                    );
                                })
                            )
                        ),
                        React.createElement(
                            'div',
                            { 'class': 'component-grid-item' },
                            React.createElement(YearsSlider, { ref: this.yearsSlider })
                        )
                    )
                );
            }
        }
    }]);

    return SelectionBox;
}(React.Component);

var YearsSlider = function (_React$Component2) {
    _inherits(YearsSlider, _React$Component2);

    function YearsSlider(props) {
        _classCallCheck(this, YearsSlider);

        var _this3 = _possibleConstructorReturn(this, (YearsSlider.__proto__ || Object.getPrototypeOf(YearsSlider)).call(this, props));

        _this3.handleCountriesChange = function (country_name) {
            var countries = JSON.parse(localStorage.getItem('countries'));
            var years = Object.keys(countries[country_name]);
            var min = Math.min.apply(Math, years);
            _this3.setState({
                min: min,
                max: Math.max.apply(Math, years),
                value: min
            });
        };

        _this3.updateValue = function () {
            var slider = document.getElementById('years-slider');
            _this3.setState({
                value: slider.value
            });
        };

        _this3.state = {
            min: 0,
            max: 100,
            value: 0
        };
        return _this3;
    }

    _createClass(YearsSlider, [{
        key: 'render',
        value: function render() {
            var _state2 = this.state,
                min = _state2.min,
                max = _state2.max,
                value = _state2.value;

            return React.createElement(
                'div',
                { className: 'YearSlider' },
                React.createElement('input', { type: 'range', 'class': 'slider', id: 'years-slider', min: min, max: max, value: value, onChange: this.updateValue }),
                React.createElement(
                    'p',
                    null,
                    'Year: ',
                    value
                )
            );
        }
    }]);

    return YearsSlider;
}(React.Component);

var selectionBox = document.querySelector('#selection-box');
ReactDOM.render(React.createElement(SelectionBox, null), selectionBox);

var TextArea = function (_React$Component3) {
    _inherits(TextArea, _React$Component3);

    function TextArea(props) {
        _classCallCheck(this, TextArea);

        var _this4 = _possibleConstructorReturn(this, (TextArea.__proto__ || Object.getPrototypeOf(TextArea)).call(this, props));

        _this4.state = {};
        return _this4;
    }

    _createClass(TextArea, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'TextArea' },
                React.createElement(
                    'p',
                    null,
                    'PLACEHOLDER DOG'
                )
            );
        }
    }]);

    return TextArea;
}(React.Component);

var textArea = document.querySelector('#text-area');
ReactDOM.render(React.createElement(TextArea, null), textArea);