#!/bin/bash

cp -r artifacts/contracts/Action.sol/Action.json ../iot-payment/src/Abi/Action.json
cp -r artifacts/contracts/ActionFactory.sol/ActionFactory.json ../iot-payment/src/Abi/ActionFactory.json
cp -r artifacts/contracts/Device.sol/Device.json ../iot-payment/src/Abi/Device.json
cp -r artifacts/contracts/DeviceFactory.sol/DeviceFactory.json ../iot-payment/src/Abi/DeviceFactory.json
cp -r artifacts/contracts/Balance.sol/Balance.json ../iot-payment/src/Abi/Balance.json
cp -r artifacts/contracts/OrganizationFactory.sol/OrganizationFactory.json ../iot-payment/src/Abi/OrganizationFactory.json
cp -r artifacts/contracts/Organization.sol/Organization.json ../iot-payment/src/Abi/Organization.json
cp -r artifacts/contracts/FundRaising.sol/FundRaising.json ../iot-payment/src/Abi/FundRaising.json
cp -r artifacts/contracts/Campaign.sol/Campaign.json ../iot-payment/src/Abi/Campaign.json


echo "copied all values to react src directory"