import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// destructured alerts.
// make sure alerts exist, map through them to create an alert with the alert type
const Alert = ({ alerts }) =>
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            { alert.msg }
        </div>
    ));


Alert.propTypes = {
    alerts: PropTypes.array.isRequired
};

// get alert state -- makes props.alerts available
const mapStateToProps = state => ({
    alerts: state.alert
})

export default connect(mapStateToProps)(Alert);


