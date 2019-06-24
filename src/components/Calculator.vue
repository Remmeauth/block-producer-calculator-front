<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs8 offset-xs2>
                <v-container grid-list-xl text-xs-center>
                    <form>
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
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                    v-model="economyActiveBlockProducersStakes"
                                    :error-messages="economyActiveBlockProducersStakesErrors"
                                    label="Amount of REM staked by other block producers"
                                    required
                                    @input="$v.economyActiveBlockProducersStakes.$touch()"
                                    @blur="$v.economyActiveBlockProducersStakes.$touch()"
                                    placeholder="300000000"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                    v-model="economyActiveBlockProducersVotes"
                                    :error-messages="economyActiveBlockProducersVotesErrors"
                                    label="Amount of votes other active block producers (TOP 21) have"
                                    required
                                    @input="$v.economyActiveBlockProducersVotes.$touch()"
                                    @blur="$v.economyActiveBlockProducersVotes.$touch()"
                                    placeholder="10000000"
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
                                <v-text-field
                                    v-model="blockProducerVotes"
                                    :error-messages="blockProducerVotesErrors"
                                    label="Votes number"
                                    required
                                    @input="$v.blockProducerVotes.$touch()"
                                    @blur="$v.blockProducerVotes.$touch()"
                                    placeholder="1000000"
                                ></v-text-field>
                                <br>
                            </v-flex>
                            <v-flex xs6>
                                <v-btn @click="calculateInvestmentsPayback">Calculate</v-btn>  
                            </v-flex>
                        </v-layout>                                                               
                    </form>
                </v-container>
            </v-flex>
        </v-layout>
        
        <div id="caclulationResultForm">
            <section v-if="isGenericRequestError">
                <p>We're sorry, we're not able to retrieve this information at the moment, please try back later.</p>
            </section>
            <section v-else>
                <p>{{ caclulationResult }}</p>
            </section>
        </div>
    </v-container>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'

import { validationMixin, Vuelidate } from 'vuelidate'
import { required, integer, decimal } from 'vuelidate/lib/validators'

Vue.use(Vuelidate)

export default {
    name: 'Calculator',
    mixins: [validationMixin],
    validations: {
        economyMoneyPerMonth: { required, integer },
        economyTokenPrice: { required, decimal },
        economyActiveBlockProducersStakes: { required, integer },
        economyActiveBlockProducersVotes: { required, integer },
        blockProducerStake: { required, integer },
        blockProducerVotes: { required, integer },
    },
    data() {
        return {
            caclulationResult: null,
            isGenericRequestError: false,
            economyMoneyPerMonth: null,
            economyTokenPrice: null,
            economyActiveBlockProducersStakes: null,
            economyActiveBlockProducersVotes: null,
            blockProducerStake: null,
            blockProducerVotes: null,
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
        economyActiveBlockProducersStakesErrors () {
            const errors = []
            if (!this.$v.economyActiveBlockProducersStakes.$dirty) return errors
            !this.$v.economyActiveBlockProducersStakes.required && errors.push('This field is required.')
            !this.$v.economyActiveBlockProducersStakes.integer && errors.push('This field should be an integer.')
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
    methods: {
        calculateInvestmentsPayback: function () {
            this.$v.$touch()

            axios
                .post('https://bpc-back-production.herokuapp.com/investments-payback/month', {
                    economy: {
                        money_per_month: this.economyMoneyPerMonth,
                        token_price: this.economyTokenPrice,
                        active_block_producers_stakes: this.economyActiveBlockProducersStakes,
                        active_block_producers_votes: this.economyActiveBlockProducersVotes
                    },
                    block_producer: {
                        stake: this.blockProducerStake,
                        votes: this.blockProducerVotes
                    }
                })
                .then(
                    response => (this.caclulationResult = response.data.payback)
                )
                .catch(error => {
                    this.isGenericRequestError = true
                })
        }
    }
}
</script>

<style>
.container {
    padding-top: 0;
}
</style>
