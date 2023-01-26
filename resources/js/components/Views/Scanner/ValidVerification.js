import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Typography, Space, Button } from 'antd';
import { useAtomValue, useResetAtom, useUpdateAtom } from 'jotai/utils';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import {
  getCustomChecklists,
  postGuestVehicle,
  putGuestVehicle,
  scanerHoldingArea,
  scannerValid,
} from '../../../services/api';
import {
  actionTakenValueAtom,
  barrierAtom,
  bookingDetailsAtom,
  customChecklistAtom,
  guestAdditionalGuestValueAtom,
  guestAdditionalVehiclesValueAtom,
  guestAssignedVehiclesValueAtom,
  guestListAtom,
  guestVehiclesValueAtom,
  scanDataMobileAtom,
  scanDataHoaAtom
} from '../../../atoms';
import Guests from './Table/Guests';
import Details from './Table/Details';
import CustomChecklist from './Table/CustomChecklist';

const Verification = () => {
  const getCustomChecklistsAPI = getCustomChecklists();
  const postGuestVehicleAPI = postGuestVehicle();
  const putGuestVehicleAPI = putGuestVehicle();
  const scanDataMobile = useAtomValue(scanDataMobileAtom);
  const setBarrier = useUpdateAtom(barrierAtom);
  const scanHoldingAreaAPI = scanerHoldingArea();
  const scanValidAPI = scannerValid();
  const bookingDetails = useAtomValue(bookingDetailsAtom);
  const customChecklists = useAtomValue(customChecklistAtom);
  const guestLists = useAtomValue(guestListAtom);
  const [isValidated, setIsValidated] = useState(false);
  const [isHoldingArea, setIsHoldingArea] = useState(false);
  const actionTaken = useAtomValue(actionTakenValueAtom);
  const guestVehicles = useAtomValue(guestVehiclesValueAtom);
  const guestAssignedVehicles = useAtomValue(guestAssignedVehiclesValueAtom);
  const guestAdditionalVehicles = useAtomValue(guestAdditionalVehiclesValueAtom);
  const guestAdditionalGuests = useAtomValue(guestAdditionalGuestValueAtom);
  const guestActionTakenReset = useResetAtom(actionTakenValueAtom);
  const guestVehiclesReset = useResetAtom(guestVehiclesValueAtom);
  const guestAssignedVehiclesReset = useResetAtom(guestAssignedVehiclesValueAtom);
  const guestAdditionalVehiclesReset = useResetAtom(guestAdditionalVehiclesValueAtom);
  const guestAdditionalGuestsReset = useResetAtom(guestAdditionalGuestValueAtom);
  const scanDataMobileReset = useResetAtom(scanDataMobileAtom);
  const scanDataHoaReset = useResetAtom(scanDataHoaAtom);
  const processGuestAdditionalVehicles = async guestAdditionalVehicles => {
    for (const vehicle of guestAdditionalVehicles) {
      const updatedVehicle = {
        booking_reference_number: scanDataMobile.details.booking_reference_number,
        ...vehicle,
      };

      await postGuestVehicleAPI.mutateAsync(updatedVehicle);
    }
  };

  const getBookingGuestVehicles = () => {
    const bookingGuestVehicles = {};
    let additionalVehicleId = -1;

    scanDataMobile.booking.guest_vehicles.map(vehicle => {
      const sanitizedVehicle = pick(vehicle, ['id', 'model', 'plate_number']);
      bookingGuestVehicles[sanitizedVehicle.id] = sanitizedVehicle;
    });
    guestVehicles.map(vehicle => {
      if (/^additional-/.test(vehicle.id)) {
        additionalVehicleId = Number(vehicle.id.replace('additional-', ''));
      }

      bookingGuestVehicles[vehicle.id] = vehicle;
    });
    guestAdditionalVehicles.map(vehicle => {
      additionalVehicleId++;
      vehicle['id'] = `additional-${additionalVehicleId}`;
      bookingGuestVehicles[vehicle.id] = vehicle;
    });

    return bookingGuestVehicles;
  };

  const onSubmit = (status = 'validated') => {
    let arg = {
      action_taken: isEmpty(actionTaken)
        ? null
        : actionTaken,
      checklists: {
        booking: bookingDetails,
        customChecklists,
        guests: guestLists,
      },
      booking_reference_number: scanDataMobile.details.booking_reference_number,
      reference_number: scanDataMobile.details.reference_number,
      additional_vehicles: isEmpty(guestAdditionalVehicles)
        ? null
        : guestAdditionalVehicles,
      additional_guests: isEmpty(guestAdditionalGuests)
        ? null
        : guestAdditionalGuests,
      guest_vehicles: guestAssignedVehicles,
      booking_guest_vehicles: getBookingGuestVehicles(),
      scan_status: 'valid',
      status,
      tap_id: scanDataMobile.tap_id,
    };

    //reset atom
    guestActionTakenReset();
    guestVehiclesReset();
    guestAssignedVehiclesReset();
    guestAdditionalVehiclesReset();
    guestAdditionalGuestsReset();
    scanDataMobileReset();
    scanDataHoaReset();

    if (guestVehicles.length) {
      guestVehicles.map(vehicle => {
        if (/^additional/.test(vehicle.id)) {
          putGuestVehicleAPI.mutate({
            values: vehicle,
            bookingReferenceNumber: scanDataMobile.details.booking_reference_number
          });
        } else {
          putGuestVehicleAPI.mutate({ values: vehicle, bookingReferenceNumber: '' });
        }
      });
    }

    if (guestAdditionalVehicles.length) {
      processGuestAdditionalVehicles(guestAdditionalVehicles);
    }

    // notify to open barrier
    setBarrier(true);
    status === 'validated'
      ? scanValidAPI.mutate(arg)
      : scanHoldingAreaAPI.mutate(arg);
  };

  useEffect(() => {
    const findFalsyValue = (data) => filter(data, (value) => value === false);
    const findTruthyValue = (data) => filter(data, (value) => value === true);
    const booking = findFalsyValue(bookingDetails);
    const checklist = findFalsyValue(customChecklists);
    const guest = findTruthyValue(guestLists);

    setIsHoldingArea(false);
    setIsValidated(true);

    if (booking.length || checklist.length) {
      return;
    }

    if (guest.length) {
      setIsHoldingArea(false);
      setIsValidated(false);
      return;
    }
  }, [bookingDetails, customChecklists, guestLists]);

  return (
    <>
      <Row justify="space-around" align="middle" className="h-screen">
        <Col className="flex flex-col min-h-screen w-screen p-5">
          <div className="flex-grow bg-white">
            <h3 className="text-center pt-5">
              <Typography.Text>
                Scanned Code Information
              </Typography.Text>
            </h3>

            <Divider orientation="left">
              Booking Details
            </Divider>
            <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
              <Details />
            </div>

            <Divider orientation="left">
              Guests List
            </Divider>
            <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
              <Guests />
            </div>

            {getCustomChecklistsAPI.data?.data.length > 0 && <>
              <Divider orientation="left">
              Custom Checklist
              </Divider>
              <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
                <CustomChecklist />
              </div>
            </>}

            <div className="text-center my-5">
              <Space align="center">
                <Button
                  type="primary"
                  size="large"
                  disabled={isValidated}
                  onClick={() => onSubmit('validated')}
                  loading={scanHoldingAreaAPI.isLoading || scanValidAPI.isLoading}>
                    Validated
                </Button>
                <Button
                  size="large"
                  disabled={isHoldingArea}
                  onClick={() => {
                    const status = guestAdditionalGuests.length
                      ? 'for-additional-guests'
                      : 'on-hold';
                    onSubmit(status);
                  }}
                  loading={scanHoldingAreaAPI.isLoading || scanValidAPI.isLoading}>
                    Holding Area
                </Button>
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Verification;
