<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg10 xl8 offset-lg1 offset-xl2>
                <v-container grid-list-xl text-xs-center>
                    <form>
                        <v-layout row wrap justify-center v-if="isDisclaimerViewedByUser">
                            <v-flex xs12 sm10 md12 lg12 xl12 style="padding-bottom:0px;">
                                <v-switch 
                                    v-model="switchForTop21" 
                                    :label="`I plan to run for the top 21`"
                                    color="#533971"
                                ></v-switch>
                            </v-flex>
                            <v-flex xs12>
                                <h3>Blockchain parameters</h3>
                            </v-flex>
                            <v-flex xs12 sm10 md6 lg6 xl6>
                                <v-text-field
                                    v-model="economyMoneyPerMonth"
                                    type="text"
                                    :error-messages="economyMoneyPerMonthErrors"
                                    label="How much dollars comes into the REMChain economy"
                                    required
                                    @input="$v.economyMoneyPerMonth.$touch()"
                                    @blur="$v.economyMoneyPerMonth.$touch()"
                                    placeholder="100,000"
                                    hint="Per month."
                                    persistent-hint
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm10 md6 lg6 xl6>
                                <v-text-field
                                    v-model="economyTokenPrice"
                                    :error-messages="economyTokenPriceErrors"
                                    label="Token price"
                                    required
                                    @input="$v.economyTokenPrice.$touch()"
                                    @blur="$v.economyTokenPrice.$touch()"
                                    placeholder="0.0071"
                                    hint="By default, we get the token price from <a href='https://coinmarketcap.com/'>CoinMarketCap</a>."
                                    persistent-hint
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm10 md6 lg6 xl6>
                                <v-text-field
                                    v-model="economyAllBlockProducersStakes"
                                    type="text"
                                    :error-messages="economyAllBlockProducersStakesErrors"
                                    label="Amount of REM staked by other block producers"
                                    required
                                    @input="$v.economyAllBlockProducersStakes.$touch()"
                                    @blur="$v.economyAllBlockProducersStakes.$touch()"
                                    placeholder="350,000,000"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm10 md6 lg6 xl6>
                                <v-text-field
                                    v-model="economyTokenPriceGrowthPercent"
                                    type="number"
                                    min="0"
                                    :error-messages="economyTokenPriceGrowthPercentErrors"
                                    label="Token price growth percent per month"
                                    @input="$v.economyTokenPriceGrowthPercent.$touch()"
                                    @blur="$v.economyTokenPriceGrowthPercent.$touch()"
                                    placeholder="3"
                                    hint="Is used for returning on investement."
                                    persistent-hint
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm10 md6 lg6 xl6>
                                <v-text-field v-if="switchForTop21"
                                    v-model="economyActiveBlockProducersVotes"
                                    type="text"
                                    :error-messages="economyActiveBlockProducersVotesErrors"
                                    label="Amount of votes other active block producers (TOP 21) have"
                                    @input="$v.economyActiveBlockProducersVotes.$touch()"
                                    @blur="$v.economyActiveBlockProducersVotes.$touch()"
                                    placeholder="300,000,000"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs6></v-flex>
                            <v-flex xs12>
                                <h3>Block Producer parameters</h3>
                            </v-flex>
                            <v-flex xs12 sm10 md6 lg6 xl6>
                                <v-text-field
                                    v-model="blockProducerStake"
                                    type="text"
                                    :error-messages="blockProducerStakeErrors"
                                    label="Stake number"
                                    required
                                    @input="$v.blockProducerStake.$touch()"
                                    @blur="$v.blockProducerStake.$touch()"
                                    placeholder="300,000"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm10 md6 lg6 xl6>
                                <v-text-field v-if="switchForTop21"
                                    v-model="blockProducerVotes"
                                    type="text"
                                    :error-messages="blockProducerVotesErrors"
                                    label="Votes number"
                                    @input="$v.blockProducerVotes.$touch()"
                                    @blur="$v.blockProducerVotes.$touch()"
                                    placeholder="300,000"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 style="padding-top:0px; padding-bottom:0px;">
                                <v-btn class="white--text" @click="calculateInvestmentsPayback" color="#5D80DB">
                                    <b>Calculate</b>
                                </v-btn>
                                <br>
                                <v-btn flat class="showDisclaimer" @click="showDisclaimer">
                                    <b>Disclaimer</b>
                                </v-btn>
                            </v-flex>
                            <v-flex xs12 v-if="isRoiCalculated">
                                <h3>Expected reward calculation</h3>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12 v-if="isErrorDuringCalculation" style="padding-top:0px;">
                                <h2 align="center" id="calculationErrorMessage"> {{ calculationErrorMessage }}</h2>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12 v-if="isRoiCalculated">
                                <h4>Return on investment in tokens: {{ roiPercentInTokens }}%</h4>
                                <h4>Return on investment in dollars: {{ roiPercentInDollars }}%</h4>
                                <br>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12 v-if="isRoiCalculated">
                                <v-data-table
                                    :headers="roiStatisticsTableHeaders"
                                    :items="roiStatistics"
                                    class="elevation-1"
                                    hide-actions
                                ><template v-slot:items="props">
                                    <td class="text-xs-center">{{ props.item.month }}</td>
                                    <td class="text-xs-center">{{ props.item.block_producer_stake_in_tokens | leaveNumbersAfterDotInFloatFilter(0) }}</td>
                                    <td class="text-xs-center">{{ props.item.month_reward_in_tokens | leaveNumbersAfterDotInFloatFilter(0) }}</td>
                                    <td class="text-xs-center">{{ props.item.block_producer_stake_in_fiat | leaveNumbersAfterDotInFloatFilter(0) }}</td>
                                    <td class="text-xs-center">{{ props.item.month_reward_in_fiat | leaveNumbersAfterDotInFloatFilter(2) }}</td>
                                    <td class="text-xs-center">{{ props.item.token_price | leaveNumbersAfterDotInFloatFilter(6) }}</td>
                                    </template>
                                </v-data-table>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap justify-center align-center v-else>
                            <v-flex xs12 sm10 md12 lg12 xl12>
                            </v-flex>
                            <v-flex xs12 sm10 md12 lg12 xl12>
                                <v-card-title primary-title class="layout justify-center">
                                    <h2>Disclaimer</h2>
                                </v-card-title>
                                <v-card-text style="text-align: justify; font-size: 1.1em; text-indent: 40px;">
                                    <h4 style="font-weight: 500;">The Remme Block Producer Calculator is designed for information purpose only. 
                                        The information on this webpage is provided solely on the basis that you will make your own investment decisions. </h4>
                                        <br>
                                    <h4 style="font-weight: 500;">All results produced by the calculator are from the assumptions made by the Remme team, 
                                        their experience, research and assumptions. We do not guarantee or make promises as to any results that may be 
                                        obtained from using this calculator. Before making any investment decision you should seek professional advice or 
                                        independently research and verify any information received from this calculator whether for the purpose of becoming
                                        a block producer holder or otherwise. You will be able to practically check your own conclusions and assumptions while
                                        running a block producer in the testnet.</h4>
                                        <br>
                                    <h4 style="font-weight: 500;">By using this calculator you agree that the calculations made by it are not treated as 
                                        financial advice. Although care has been taken in preparing information being a background for calculations, 
                                        we cannot be held responsible for any errors or omissions, and we accept no liability whatsoever for any loss or 
                                        damage you may incur.</h4>
                                </v-card-text>
                            </v-flex>
                            <v-flex xs12>
                                <v-btn class="white--text" @click="userAcceptDislaimer" color="#5D80DB"><b>Close</b></v-btn>
                            </v-flex>
                        </v-layout>                                                            
                    </form>
                </v-container>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import reactiveStorage from "vue-reactive-storage"

import { validationMixin, Vuelidate } from 'vuelidate'
import { required, integer, decimal } from 'vuelidate/lib/validators'
import { constants } from 'crypto';
import { type } from 'os';


Vue.use(reactiveStorage, {
    "isDisclaimerViewedByUser": false,
});

Vue.use(Vuelidate)

var numeral = require('numeral');

const productionHostUrl = 'https://bpc-back-production.herokuapp.com'
const yearInMonthsToCalculateRoi = 12

/**
 * Leave the numbers after the dot in the float.
 * 
 * Reference: https://stackoverflow.com/questions/6525335/trim-to-2-decimals
 *
 * @param {object} number - number.
 * @param {object} count - number of decimal places.
 */
function leaveNumbersAfterDotInFloat(number, count) {
    return Math.floor(number * (100 ** (count / 2))) / (100 ** (count / 2));
}

/**
 * Remove commas in the string to convert to a number.
 *
 * @param {object} string - string to convert to a number.
 */
function removeCommasInStringToConvertToNumber(string) {
    return Number(string.toString().replace(/,/g, ''));
}

/**
 * Separate the number with commas.
 *
 * @param {object} number - number to separate.
 */
function separateNumberWithCommas(number) {
    return number.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Convert the number to a string with commas.
 *
 * @param {object} number - number to convert to string.
 */
function convertNumberToStringWithCommas(number) {
    return numeral(number).format("0,0");
}

export default {
    name: 'Calculator',
    mixins: [validationMixin],
    validations: {
        economyMoneyPerMonth: { required, integer },
        economyTokenPrice: { required, decimal },
        economyTokenPriceGrowthPercent: { required, integer },
        economyAllBlockProducersStakes: { required, integer },
        economyActiveBlockProducersVotes: { required, integer },
        blockProducerStake: { required, integer },
        blockProducerVotes: { required, integer },
    },
    data() {
        return {
            isDisclaimerViewedByUser: localStorage.isDisclaimerViewedByUser,
            isErrorDuringCalculation: false,
            calculationErrorMessage: null,
            economyMoneyPerMonth: convertNumberToStringWithCommas(100000),
            economyTokenPrice: null,
            economyTokenPriceGrowthPercent: 3,
            economyAllBlockProducersStakes: convertNumberToStringWithCommas(350000000),
            economyActiveBlockProducersVotes: convertNumberToStringWithCommas(300000000),
            blockProducerStake: convertNumberToStringWithCommas(300000),
            blockProducerVotes: convertNumberToStringWithCommas(300000),
            switchForTop21: false,
            isRoiCalculated: false,
            roiPercentInTokens: null,
            roiPercentInDollars: null,
            roiStatistics: [],
            roiStatisticsTableHeaders: [
                { text: 'Month', value: 'month', sortable: false },
                { text: 'Block producer stake in tokens', value: 'stake-in-tokens', sortable: false },
                { text: 'Reward in tokens', value: 'reward-token', sortable: false },
                { text: 'Block producer stake in dollars', value: 'stake-in-dollars', sortable: false },
                { text: 'Reward in dollars', value: 'reward-dollars', sortable: false },
                { text: 'Token price', value: 'token-price', sortable: false },
            ],
        }
    },
    computed: {
        economyMoneyPerMonthErrors () {
            const errors = []
            if (!this.$v.economyMoneyPerMonth.$dirty) return errors
            !this.$v.economyMoneyPerMonth.required && errors.push('This field is required.')
            return errors
            
        },
        economyTokenPriceErrors () {
            const errors = []
            if (!this.$v.economyTokenPrice.$dirty) return errors
            !this.$v.economyTokenPrice.required && errors.push('This field is required.')
            !this.$v.economyTokenPrice.decimal && errors.push('This field should be a decimal or integer.')
            return errors
        },
        economyTokenPriceGrowthPercentErrors () {
            const errors = []
            if (!this.$v.economyTokenPriceGrowthPercent.$dirty) return errors
            !this.$v.economyTokenPriceGrowthPercent.required && errors.push('This field is required.')
            return errors
        },
        economyAllBlockProducersStakesErrors () {
            const errors = []
            if (!this.$v.economyAllBlockProducersStakes.$dirty) return errors
            !this.$v.economyAllBlockProducersStakes.required && errors.push('This field is required.')
            return errors
        },   
        economyActiveBlockProducersVotesErrors () {
            const errors = []
            if (!this.$v.economyActiveBlockProducersVotes.$dirty) return errors
            !this.$v.economyActiveBlockProducersVotes.required && errors.push('This field is required.')
            return errors
          },
        blockProducerStakeErrors () {
            const errors = []
            if (!this.$v.blockProducerStake.$dirty) return errors
            !this.$v.blockProducerStake.required && errors.push('This field is required.')
            return errors
        },
        blockProducerVotesErrors () {
            const errors = []
            if (!this.$v.blockProducerVotes.$dirty) return errors
            !this.$v.blockProducerVotes.required && errors.push('This field is required.')
            return errors
        }               
    },
    filters: {
        leaveNumbersAfterDotInFloatFilter: function (value, NumbersAfterDot) {
            return leaveNumbersAfterDotInFloat(value, NumbersAfterDot)
        }
    },
    watch: {
        economyMoneyPerMonth(newv) {
            Vue.nextTick(() => this.economyMoneyPerMonth = separateNumberWithCommas(newv));
        },
        economyAllBlockProducersStakes(newv) {
            Vue.nextTick(() => this.economyAllBlockProducersStakes = separateNumberWithCommas(newv));
        },
        economyActiveBlockProducersVotes(newv) {
            Vue.nextTick(() => this.economyActiveBlockProducersVotes = separateNumberWithCommas(newv));
        },
        blockProducerStake(newv) {
            Vue.nextTick(() => this.blockProducerStake = separateNumberWithCommas(newv));
        },
        blockProducerVotes(newv) {
            Vue.nextTick(() => this.blockProducerVotes = separateNumberWithCommas(newv));
        }
    },
    mounted() {
        axios
            .get(productionHostUrl + '/token/price/usd')
            .then(response => {
                this.economyTokenPrice = leaveNumbersAfterDotInFloat(response.data.result, 6)
            })
    },
    methods: {
        userAcceptDislaimer: function () {
            this.isDisclaimerViewedByUser = this.localStorage.isDisclaimerViewedByUser = true
        },
        showDisclaimer: function () {
            this.isDisclaimerViewedByUser = this.localStorage.isDisclaimerViewedByUser = false
        },
        calculateInvestmentsPayback: function () {
            this.$v.$touch()

            if (this.switchForTop21 === false) {
                // If user's block producer has zero votes, it does not matter how much
                // votes other activate block producers (top 21) have, so any random integer.
                this.economyActiveBlockProducersVotes = 1
                this.blockProducerVotes = 0
            }

            axios
                .post(productionHostUrl + '/profit/roi', {
                    months: yearInMonthsToCalculateRoi,
                    economy: {
                        money_per_month: removeCommasInStringToConvertToNumber(this.economyMoneyPerMonth),
                        token_price: this.economyTokenPrice,
                        token_price_growth_percent: this.economyTokenPriceGrowthPercent,
                        all_block_producers_stakes: removeCommasInStringToConvertToNumber(this.economyAllBlockProducersStakes),
                        active_block_producers_votes: removeCommasInStringToConvertToNumber(this.economyActiveBlockProducersVotes)
                    },
                    block_producer: {
                        stake: removeCommasInStringToConvertToNumber(this.blockProducerStake),
                        votes: removeCommasInStringToConvertToNumber(this.blockProducerVotes)
                    }
                })
                .then(response => {
                    this.isRoiCalculated = true
                    this.roiPercentInTokens = leaveNumbersAfterDotInFloat(response.data.result.percents.tokens, 2)
                    this.roiPercentInDollars = leaveNumbersAfterDotInFloat(response.data.result.percents.fiat, 2)
                    this.roiStatistics = response.data.result.statistics_per_month
                })
                .catch(error => {
                    this.isErrorDuringCalculation = true
                    this.calculationErrorMessage = `We are sorry, something went wrong.`
                })

            if (this.switchForTop21 === false) {
                // Fill up fields with default value after calculation.
                this.economyActiveBlockProducersVotes = 300000000
                this.blockProducerVotes = 300000
            }
        }
    }
}
</script>

<style>
.container {
    padding-top: 0;
}

.v-input--selection-controls {
    margin-top: 10px;
    padding-top: 4px;
    height: 35px;
}

.v-btn.showDisclaimer {
    text-decoration: underline; 
    text-transform: capitalize;
}

.showDisclaimer:hover:before {
    background-color: transparent;
}

#calculationErrorMessage {
    color: red;
}
</style>
