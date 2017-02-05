class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
		this.states = config.states;
		this.initState = config.initial;
		this.activeState = config.initial;
		this.logStates = [];
		this.logStates.push(this.activeState);
		this.logStatesIndex = 0;
	}

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
		return this.activeState;
	}

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
		if (this.states.hasOwnProperty(state))
		{
			this.activeState = state;
			if (this.logStatesIndex + 1 < this.logStates.length)
			{
				this.logStates = this.logStates.slice(0, this.logStatesIndex);
			}
			this.logStatesIndex = this.logStates.length;
			this.logStates.push(state);
		}
		else
			throw new Error();
	}

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
		let transitions = this.states[this.activeState].transitions;
        if (transitions != null) {
            let newState = transitions[event];
            if (newState != null) {
                this.changeState(newState);
            }
			else
				throw new Error();
        }
	}

    /**
     * Resets FSM state to initial.
     */
    reset() {
		this.activeState = this.initState;
		this.logStates = [];
		this.logStatesIndex = 0;
		this.logStates.push(this.activeState);
	}

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
		let keys = Object.keys(this.states);
        if (event == null) {
            return keys;
        } else {
            let eventStates = [];
            for (let key in keys) {
                if (keys.hasOwnProperty(key)) {
                    if (this.states[keys[key]].transitions.hasOwnProperty(event)) {
                        eventStates.push(keys[key]);
                    }
                }
            }
            return eventStates;
        }
	}

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
		if (this.logStatesIndex > 0)
		{
			this.activeState = this.logStates[--this.logStatesIndex];
			return true;
		}
		else
			return false;
	}

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
		if (this.logStatesIndex + 1 < this.logStates.length)
		{
			this.activeState = this.logStates[++this.logStatesIndex];
			return true;
		}
		else
			return false;
	}

    /**
     * Clears transition history
     */
    clearHistory() {
		this.logStates = [];
		this.logStatesIndex = 0;
		this.logStates.push(this.activeState);
	}
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
