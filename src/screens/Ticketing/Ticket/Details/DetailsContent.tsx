import React, {useState} from 'react';
import {FareContract} from '../../../../api/fareContracts';
import ThemeText from '../../../../components/text';
import * as Sections from '../../../../components/sections';
import ValidityHeader from '../ValidityHeader';
import ValidityLine from '../ValidityLine';
import {formatToLongDateTime} from '../../../../utils/date';
import {fromUnixTime} from 'date-fns';
import nb from 'date-fns/locale/nb';

type Props = {
  fareContract: FareContract;
  now: number;
  onReceiptNavigate: () => void;
};

const DetailsContent: React.FC<Props> = ({
  fareContract: fc,
  now,
  onReceiptNavigate,
}) => {
  const nowSeconds = now / 1000;
  const isValidTicket = fc.usage_valid_to >= nowSeconds;

  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <ValidityHeader
          isValid={isValidTicket}
          nowSeconds={nowSeconds}
          validTo={fc.usage_valid_to}
        />
        <ValidityLine
          isValid={isValidTicket}
          nowSeconds={nowSeconds}
          validFrom={fc.usage_valid_from}
          validTo={fc.usage_valid_to}
        />
        <ThemeText>
          {fc.user_profiles.length > 1
            ? `${fc.user_profiles.length} voksne`
            : `1 voksen`}
        </ThemeText>
        <ThemeText type="lead" color="faded">
          {fc.product_name}
        </ThemeText>
        <ThemeText type="lead" color="faded">
          Sone A - Stor-Trondheim
        </ThemeText>
      </Sections.GenericItem>
      <Sections.GenericItem>
        <ThemeText>Ordre-id: {fc.order_id}</ThemeText>
        <ThemeText type="lead" color="faded">
          Kjøpt {formatToLongDateTime(fromUnixTime(fc.usage_valid_from), nb)}
        </ThemeText>
      </Sections.GenericItem>
      {isValidTicket && <Sections.LinkItem text="Vis for kontroll" disabled />}
      <Sections.LinkItem text="Be om refusjon" disabled />
      <Sections.LinkItem text="Be om kvittering" onPress={onReceiptNavigate} />
    </Sections.Section>
  );
};

export default DetailsContent;
