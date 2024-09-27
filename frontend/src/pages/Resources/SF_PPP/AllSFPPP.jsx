import React from 'react'
import Itm from './BSC_ITM/Itm'
import Imba from './IMBA/Imba'
import Imca from './IMCA/Imca'
import Bioinformatics from './IMSC_BI/Bioinformatics'
import Etc from './IMSC_ETC/Etc'
import Law from './LAW/Law'
import PMIR from './MA_PMIR/PMIR.JSX'
import Majmc from './MAJMC/Majmc'
import Mathm from './MATHM/Mathm'
import MbaAb from './MBA_AB/MbaAb'
import Mcfc from './MCFC/Mcfc'

const AllSFPPP = () => {
  return (
    <div>
        <Itm />
        <Imba />
        <Imca/>
        <Bioinformatics/>
        <Etc/>
        <Law/>
        <PMIR/>
        <Majmc/>
        <Mathm/>
        <MbaAb/>
        <Mcfc/>
    </div>
  )
}

export default AllSFPPP