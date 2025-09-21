import KnittingMachine from "./KnittinngMachineForm";
import YarnSpinningMachine from "./YarnSpinningMachineForm";
import YarnProcessingMachine from "./YarnProcessingMachineForm";
import WeavingMachine from "./WeavingMachineForm";
import DyeingMachine from "./DyeingMachineForm";
import FabricProcessingMachine from "./FabricProcessingMachineForm";
import FabricFinishingMachine from "./FabricFinishingMachineForm";
import WashingMachine from "./WashingMachineForm";
import CuttingMachine from "./CuttingMachineForm";
import ComputerizedEmbroideryMachine from "./ComputerizedEmbroideryMachineForm";
import ManualEmbroideryMachine from "./ManualEmbroideryMachineForm";
import FusingMachine from "./FusingMachineForm";
import PrintingMachine from "./PrintingMachineForm";
import StitchingMachine from "./StitchingMachineForm";
import CheckingMachine from "./CheckingMachineForm";
import IronPackingMachine from "./IronPackingMachineForm";
import KajaButtonMachine from "./KajaButtonMachineForm";
import MultiNeedleDoubleChainMachine from "./MultiNeedleDoubleChainMachineForm";
import OilRemovingMendingCenterMachine from "./OilRemovingMendingCenterMachineForm";
import PatternMakinigCenterMachine from "./PatternMakinigCenterMachineForm";
import FilmScreenMakingCenterMachine from "./FilmScreenMakingCenterMachineForm";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const MachineryForms: Record<string, React.ComponentType<any>> = {

    YARN_SPINNING: YarnSpinningMachine,
    YARN_PROCESSING:YarnProcessingMachine,
    WEAVING_UNIT:WeavingMachine,
    KNITTING_UNIT: KnittingMachine,
    DYEING_UNIT:DyeingMachine,
    FABRIC_PROCESSING_UNIT:FabricProcessingMachine,
    FABRIC_FINISHING_UNIT:FabricFinishingMachine,
    WASHING_UNIT:WashingMachine,
    CUTTING_UNIT:CuttingMachine,
    COMPUTERIZED_EMBROIDERY_UNIT:ComputerizedEmbroideryMachine,
    MANUAL_EMBROIDERY_UNIT:ManualEmbroideryMachine,
    FUSING_UNIT:FusingMachine,
    PRINTING_UNIT:PrintingMachine,
    STITCHING_UNIT:StitchingMachine,
    CHECKING_UNIT:CheckingMachine,
    IRONING_PACKING_UNIT:IronPackingMachine,
    KAJA_BUTTON_UNIT:KajaButtonMachine,
    MULTI_NEEDLE_DOUBLE_CHAIN_UNIT:MultiNeedleDoubleChainMachine,
    OIL_REMOVING_MENDING_CENTER:OilRemovingMendingCenterMachine,
    PATTERN_MAKING_CENTER:PatternMakinigCenterMachine,
    FILM_SCREEN_MAKING_CENTER:FilmScreenMakingCenterMachine
};
