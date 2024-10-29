import { Control, Controller } from 'react-hook-form';
import {
  IMovie,
  MoviePersonalInfo,
  SelectableModel,
} from '@giron/shared-models';
import { LabeledInput } from '@giron/shared-ui-library';
import { useState } from 'react';
import {
  Box,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import { DatePicker, PickerValidDate } from '@mui/x-date-pickers';
import {
  mapMultipleSelectionToChips,
  SelectMenuProps,
} from '@giron/shared-util-helpers';

const GRADES = ['', '5', '4.5', '4', '3.5', '3', '2.5', '2', '1.5', '1'];
const gradeOptions: SelectableModel[] = GRADES.map((g) => ({
  code: g,
  name: g,
}));

const CURRENCIES: string[] = ['', 'SEK', 'EUR', 'NOK', 'DKK', 'GBP', 'USD'];
const currencyOptions: SelectableModel[] = CURRENCIES.map((c) => ({
  code: c,
  name: c,
}));

type Props = {
  control: Control<IMovie>;
  moviePersonalInfo: MoviePersonalInfo;
};

export const InputFields = ({ control, moviePersonalInfo }: Props) => {
  const [archiveNumber, setArchiveNumber] = useState(
    moviePersonalInfo.archiveNumber ? `${moviePersonalInfo.archiveNumber}` : ''
  );
  const [grade, setGrade] = useState(
    moviePersonalInfo.grade ? `${moviePersonalInfo.grade}` : ''
  );
  const [obtainPrice, setObtainPrice] = useState(
    moviePersonalInfo.obtainPrice ? `${moviePersonalInfo.obtainPrice}` : ''
  );
  const [currency, setCurrency] = useState(moviePersonalInfo.currency || '');
  const [obtainPlace, setObtainPlace] = useState(
    moviePersonalInfo.obtainPlace || ''
  );
  const [notes, setNotes] = useState(moviePersonalInfo.notes || '');

  return (
    <>
      {/*<LabeledTextInput*/}
      {/*  control={control}*/}
      {/*  label="Arkivnummer:"*/}
      {/*  id="archiveNumber"*/}
      {/*  defaultValue={moviePersonalInfo?.archiveNumber || undefined}*/}
      {/*/>*/}

      <LabeledInput htmlFor="archiveNumber" label="Arkivnummer:">
        <Controller
          control={control}
          name="moviePersonalInfo.archiveNumber"
          render={({ field: { onChange, ...field } }) => (
            <TextField
              {...field}
              type="text"
              value={archiveNumber || ''}
              onChange={(e) => {
                onChange(e);
                setArchiveNumber(e.target.value);
              }}
            />
          )}
        />
      </LabeledInput>

      {/*<LabeledSelect*/}
      {/*  control={control}*/}
      {/*  label="Betyg:"*/}
      {/*  id="grade"*/}
      {/*  value={moviePersonalInfo?.grade ? moviePersonalInfo.grade.toString() : ''}*/}
      {/*  options={gradeOptions}*/}
      {/*  required={false}*/}
      {/*  multiple={false}*/}
      {/*/>*/}

      <LabeledInput htmlFor="grade" label="Betyg:">
        <Controller
          control={control}
          name="moviePersonalInfo.grade"
          render={({ field: { onChange, ...field } }) => (
            <Select
              {...field}
              value={grade}
              onChange={(e) => {
                onChange(e);
                setGrade(e.target.value);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {mapMultipleSelectionToChips(selected, gradeOptions)}
                </Box>
              )}
              MenuProps={SelectMenuProps}
            >
              {gradeOptions?.map((option, index) => (
                <MenuItem key={index} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </LabeledInput>

      {/*<LabeledDateInput*/}
      {/*  control={control}*/}
      {/*  label="Datum inskaffad:"*/}
      {/*  id="obtainDate"*/}
      {/*  defaultValue={moviePersonalInfo?.obtainDate}*/}
      {/*/>*/}

      <LabeledInput htmlFor="obtainDate" label="Datum inskaffad:">
        <Controller
          control={control}
          name="moviePersonalInfo.obtainDate"
          render={({ field: { ...field } }) => (
            <DatePicker
              {...field}
              format="yyyy-MM-dd"
              value={
                moviePersonalInfo.obtainDate
                  ? new Date(moviePersonalInfo.obtainDate) as PickerValidDate
                  : null
              }
            />
          )}
        />
      </LabeledInput>

      {/*<LabeledTextInput*/}
      {/*  control={control}*/}
      {/*  label="Inköpspris:"*/}
      {/*  id="obtainPrice"*/}
      {/*  defaultValue={moviePersonalInfo?.obtainPrice}*/}
      {/*/>*/}

      <LabeledInput htmlFor="obtainPrice" label="Inköpspris:">
        <Controller
          control={control}
          name="moviePersonalInfo.obtainPrice"
          render={({ field: { onChange, ...field } }) => (
            <TextField
              {...field}
              type="text"
              value={obtainPrice || ''}
              onChange={(e) => {
                onChange(e);
                setObtainPrice(e.target.value);
              }}
            />
          )}
        />
      </LabeledInput>

      {/*<LabeledSelect*/}
      {/*  control={control}*/}
      {/*  label="Valuta:"*/}
      {/*  id="currency"*/}
      {/*  value={moviePersonalInfo?.currency}*/}
      {/*  options={currencyOptions}*/}
      {/*  required={false}*/}
      {/*  multiple={false}*/}
      {/*/>*/}

      <LabeledInput htmlFor="currency" label="Valuta:">
        <Controller
          control={control}
          name="moviePersonalInfo.currency"
          render={({ field: { onChange, ...field } }) => (
            <Select
              {...field}
              value={currency}
              onChange={(e) => {
                onChange(e);
                setCurrency(e.target.value);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {mapMultipleSelectionToChips(selected, currencyOptions)}
                </Box>
              )}
              MenuProps={SelectMenuProps}
            >
              {currencyOptions?.map((option, index) => (
                <MenuItem key={index} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </LabeledInput>

      {/*<LabeledTextInput*/}
      {/*  control={control}*/}
      {/*  label="Plats för inskaffning:"*/}
      {/*  id="obtainPlace"*/}
      {/*  defaultValue={moviePersonalInfo?.obtainPlace}*/}
      {/*/>*/}

      <LabeledInput htmlFor="obtainPlace" label="Plats för inskaffning:">
        <Controller
          control={control}
          name="moviePersonalInfo.obtainPlace"
          render={({ field: { onChange, ...field } }) => (
            <TextField
              {...field}
              type="text"
              value={obtainPlace || ''}
              onChange={(e) => {
                onChange(e);
                setObtainPlace(e.target.value);
              }}
            />
          )}
        />
      </LabeledInput>

      {/*<LabeledTextarea*/}
      {/*  control={control}*/}
      {/*  label="Anteckningar:"*/}
      {/*  id="notes"*/}
      {/*  defaultValue={moviePersonalInfo?.notes}*/}
      {/*  required={false}*/}
      {/*/>*/}

      <LabeledInput htmlFor="notes" label="Anteckningar:">
        <Controller
          control={control}
          name="moviePersonalInfo.notes"
          render={({ field: { onChange, ...field } }) => (
            <TextareaAutosize
              {...field}
              minRows={3}
              value={notes || ''}
              onChange={(e) => {
                onChange(e);
                setNotes(e.target.value);
              }}
            />
          )}
        />
      </LabeledInput>
    </>
  );
};
