const { required, integer, decimal } = validators
const validationMixin = vuelidate.validationMixin

Vue.use(vuelidate.default)

new Vue({
    el: '#app',
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
          !this.$v.economyMoneyPerMonth.required && errors.push('Money per month is required.')
          !this.$v.economyMoneyPerMonth.integer && errors.push('Money per month should be an integer.')
          return errors
        },
        economyTokenPriceErrors () {
            const errors = []
            if (!this.$v.economyTokenPrice.$dirty) return errors
            !this.$v.economyTokenPrice.required && errors.push('Money per month is required.')
            !this.$v.economyTokenPrice.decimal && errors.push('Money per month should be an integer.')
            return errors
        },
        economyActiveBlockProducersStakesErrors () {
            const errors = []
            if (!this.$v.economyActiveBlockProducersStakes.$dirty) return errors
            !this.$v.economyActiveBlockProducersStakes.required && errors.push('Money per month is required.')
            !this.$v.economyActiveBlockProducersStakes.integer && errors.push('Money per month should be an integer.')
            return errors
        },   
        economyActiveBlockProducersVotesErrors () {
            const errors = []
            if (!this.$v.economyActiveBlockProducersVotes.$dirty) return errors
            !this.$v.economyActiveBlockProducersVotes.required && errors.push('Money per month is required.')
            !this.$v.economyActiveBlockProducersVotes.integer && errors.push('Money per month should be an integer.')
            return errors
          },
        blockProducerStakeErrors () {
            const errors = []
            if (!this.$v.blockProducerStake.$dirty) return errors
            !this.$v.blockProducerStake.required && errors.push('Money per month is required.')
            !this.$v.blockProducerStake.integer && errors.push('Money per month should be an integer.')
            return errors
        },
        blockProducerVotesErrors () {
            const errors = []
            if (!this.$v.blockProducerVotes.$dirty) return errors
            !this.$v.blockProducerVotes.required && errors.push('Money per month is required.')
            !this.$v.blockProducerVotes.integer && errors.push('Money per month should be an integer.')
            return errors
        },                 
      },
    methods: {
        calculateInvestmentsPayback: function (event) {
            this.$v.$touch()

            axios
                .post('https://bpc-back-staging-pr-4.herokuapp.com/investments-payback/month', {
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
                    console.log(error)
                    this.isGenericRequestError = true
                })
        }
    }
});
