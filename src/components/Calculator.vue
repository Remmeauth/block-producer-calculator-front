<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs8 offset-xs2>
                <v-container grid-list-xl text-xs-center>
                    <form>
                        <v-switch 
                            v-model="switchForTop21" 
                            :label="`I plan to run for the top 21`"
                            color="#533971"
                        ></v-switch>
                        <v-layout row wrap justify-center>
                            <v-flex xs12>
                                <h2>Blockchain parameters</h2>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                    v-model="economyMoneyPerMonth"
                                    :error-messages="economyMoneyPerMonthErrors"
                                    label="How much dollars comes into the REMChain economy"
                                    required
                                    @input="$v.economyMoneyPerMonth.$touch()"
                                    @blur="$v.economyMoneyPerMonth.$touch()"
                                    placeholder="50000"
                                    hint="Per month."
                                    persistent-hint
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs6>
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
                            <v-flex xs6>
                                <v-text-field
                                    v-model="economyAllBlockProducersStakes"
                                    :error-messages="economyAllBlockProducersStakesErrors"
                                    label="Amount of REM staked by other block producers"
                                    required
                                    @input="$v.economyAllBlockProducersStakes.$touch()"
                                    @blur="$v.economyAllBlockProducersStakes.$touch()"
                                    placeholder="350000000"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field v-if="switchForTop21"
                                    v-model="economyActiveBlockProducersVotes"
                                    :error-messages="economyActiveBlockProducersVotesErrors"
                                    label="Amount of votes other active block producers (TOP 21) have"
                                    @input="$v.economyActiveBlockProducersVotes.$touch()"
                                    @blur="$v.economyActiveBlockProducersVotes.$touch()"
                                    placeholder="300000000"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <h2>Block Producer parameters</h2>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                    v-model="blockProducerStake"
                                    :error-messages="blockProducerStakeErrors"
                                    label="Stake number"
                                    required
                                    @input="$v.blockProducerStake.$touch()"
                                    @blur="$v.blockProducerStake.$touch()"
                                    placeholder="300000"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field v-if="switchForTop21"
                                    v-model="blockProducerVotes"
                                    :error-messages="blockProducerVotesErrors"
                                    label="Votes number"
                                    @input="$v.blockProducerVotes.$touch()"
                                    @blur="$v.blockProducerVotes.$touch()"
                                    placeholder="300000"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <h2>Expected reward calculation</h2>
                            </v-flex>
                            <v-flex xs6>
                                <v-btn @click="calculateInvestmentsPayback">Calculate</v-btn>  
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                    v-model="profitPerMonthInTokens"
                                    label="Expected payback in tokens per month"
                                    placeholder="0"
                                    readonly
                                    :hint="profitPerMonthInDollarsHint"
                                    persistent-hint
                                ></v-text-field> 
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

import { validationMixin, Vuelidate } from 'vuelidate'
import { required, integer, decimal } from 'vuelidate/lib/validators'
import { constants } from 'crypto';

Vue.use(Vuelidate)

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

export default {
    name: 'Calculator',
    mixins: [validationMixin],
    validations: {
        economyMoneyPerMonth: { required, integer },
        economyTokenPrice: { required, decimal },
        economyAllBlockProducersStakes: { required, integer },
        economyActiveBlockProducersVotes: { required, integer },
        blockProducerStake: { required, integer },
        blockProducerVotes: { required, integer },
    },
    data() {
        return {
            profitPerMonthInTokens: null,
            profitPerMonthInDollars: null,
            profitPerMonthInDollarsHint: null,
            economyMoneyPerMonth: 100000,
            economyTokenPrice: null,
            economyAllBlockProducersStakes: 350000000,
            economyActiveBlockProducersVotes: 300000000,
            blockProducerStake: 300000,
            blockProducerVotes: 300000,
            switchForTop21: false,
        }
    },
    computed: {
        economyMoneyPerMonthErrors () {
          const errors = []
          if (!this.$v.economyMoneyPerMonth.$dirty) return errors
          !this.$v.economyMoneyPerMonth.required && errors.push('This field is required.')
          !this.$v.economyMoneyPerMonth.integer && errors.push('This field should be an integer.')
          return errors
        },
        economyTokenPriceErrors () {
            const errors = []
            if (!this.$v.economyTokenPrice.$dirty) return errors
            !this.$v.economyTokenPrice.required && errors.push('This field is required.')
            !this.$v.economyTokenPrice.decimal && errors.push('This field should be a decimal.')
            return errors
        },
        economyAllBlockProducersStakesErrors () {
            const errors = []
            if (!this.$v.economyAllBlockProducersStakes.$dirty) return errors
            !this.$v.economyAllBlockProducersStakes.required && errors.push('This field is required.')
            !this.$v.economyAllBlockProducersStakes.integer && errors.push('This field should be an integer.')
            return errors
        },   
        economyActiveBlockProducersVotesErrors () {
            const errors = []
            if (!this.$v.economyActiveBlockProducersVotes.$dirty) return errors
            !this.$v.economyActiveBlockProducersVotes.required && errors.push('This field is required.')
            !this.$v.economyActiveBlockProducersVotes.integer && errors.push('This field should be an integer.')
            return errors
          },
        blockProducerStakeErrors () {
            const errors = []
            if (!this.$v.blockProducerStake.$dirty) return errors
            !this.$v.blockProducerStake.required && errors.push('This field is required.')
            !this.$v.blockProducerStake.integer && errors.push('This field should be an integer.')
            return errors
        },
        blockProducerVotesErrors () {
            const errors = []
            if (!this.$v.blockProducerVotes.$dirty) return errors
            !this.$v.blockProducerVotes.required && errors.push('This field is required.')
            !this.$v.blockProducerVotes.integer && errors.push('This field should be an integer.')
            return errors
        },                 
    },
    mounted() {
        axios
            .get('https://bpc-back-production.herokuapp.com/token/price/usd')
            .then(response => {
                this.economyTokenPrice = leaveNumbersAfterDotInFloat(response.data.result, 6)
            })
    },
    methods: {
        calculateInvestmentsPayback: function () {
            this.$v.$touch()

            if (this.switchForTop21 === false) {
                // If user's block producer has zero votes, it does not matter how much
                // votes other activate block producers (top 21) have, so any random integer.
                this.economyActiveBlockProducersVotes = 1
                this.blockProducerVotes = 0
            }

            axios
                .post('https://bpc-back-production.herokuapp.com/profit/month', {
                    economy: {
                        money_per_month: this.economyMoneyPerMonth,
                        token_price: this.economyTokenPrice,
                        all_block_producers_stakes: this.economyAllBlockProducersStakes,
                        active_block_producers_votes: this.economyActiveBlockProducersVotes
                    },
                    block_producer: {
                        stake: this.blockProducerStake,
                        votes: this.blockProducerVotes
                    }
                })
                .then(response => {
                    this.profitPerMonthInTokens = leaveNumbersAfterDotInFloat(response.data.result.tokens, 0)
                    this.profitPerMonthInDollars = leaveNumbersAfterDotInFloat(response.data.result.fiat, 2)
                    this.profitPerMonthInDollarsHint = "~ $" + this.profitPerMonthInDollars.toString() + "."
                })
                .catch(error => {
                    this.profitPerMonthInTokens = `We're sorry, we're not able to retrieve this info.`
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
</style>
