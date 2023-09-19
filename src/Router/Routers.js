import { Route, Switch, BrowserRouter ,useNavigate } from 'react-router-dom';
import { FooterMenu, HeaderMenu, LeftMenu } from '../Component/Template';
import { ProductAttributeColors, ProductAttributeDimensions, ProductAttributeUnits } from '../Component/Category/Attribute';
import { GroupProducts, Product,Printproductlabel } from '../Component/Category/Product';
import { Customer, ProviderAndCurator } from '../Component/Category/Customer';
import { WareHouse, WareHouseArea, WareHouseShelve, WareHouseFloor, WareHouseLocation,WareHousePallet,WareHouseGroup } from '../Component/Category/SetupLayout';
import { ReturnInBound, InBoundList,ReturnOutBound, CreateInBound ,OutBound,OutboundList,Packing,DraftOrder, OrdersFollow,CreateStockCheck,StockCheckList,StockCheckActual} from "../Component/Main/ManagerWarehouse";
import { Login, Home, DashBoard, Logout, HomeForOfficer, HomeForDirector, AccountManagement, AccountGroup,MenuModule,MenuModulePermission,ShowPass } from "../Component/System";
import { OutboundReport,InBoundReport,InventoryPersoninCharge,ImportRatioCustomerReport,PalletReport, ExportRatioCustomerReport, InventoryRatioCustomerReport, InventoryByDateReport, InventoryByCustomerReport, ProductByLocation, InventoryByProduct,LogModuleReport } from "../Component/Main/ReportWarehouse";
import { Camera } from '../Component/Category/CameraManagement';

export const Routers = () => {
    return (

        <BrowserRouter>

            {/* please do not pass props "exact" to "fix-component"  */}
            <Route exact path="/login" component={Login} />
            <Route path="/" component={HeaderMenu} />
            <Route path="/" component={LeftMenu} />
            {/* <Route exact path="/home" component={Home} /> */}
            <Switch>
                {/* children component, you can navigate to another component and keep header footer left-sidebar */}

                {/* Router for the system */}
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/homeforOfficer" component={HomeForOfficer} />
                <Route exact path="/homefordirector" component={HomeForDirector} />
                <Route exact path="/trang-chu" component={DashBoard} />
                <Route exact path="/nhom-tai-khoan" component={AccountGroup} />
                <Route exact path="/quan-ly-tai-khoan" component={AccountManagement} />
                <Route exact path="/quan-ly-menu-module" component={MenuModule} />
                <Route exact path="/phan-quyen-he-thong" component={MenuModulePermission} />
                <Route exact path="/camera" component={Camera} />
                <Route exact path="/theo-doi-orders" component={OrdersFollow} />

                {/* Router for the main function */}
                <Route exact path="/create-in-bound" component={CreateInBound} />
                <Route exact path="/in-bound-list" component={InBoundList} />
                {/* <Route exact path="/quan-ly-van-hanh" component={ActualV2} /> */}
                <Route exact path="/outbound" component={OutBound} />
                <Route exact path="/return-inbound" component={ReturnInBound} />
                <Route exact path="/return-outbound" component={ReturnOutBound} />
                <Route exact path="/outbound-list" component={OutboundList} />
                <Route exact path="/dong-goi" component={Packing} />
                <Route exact path="/phan-hang" component={DraftOrder} />
                <Route exact path="/create-stock-check" component={CreateStockCheck} />
                <Route exact path="/stock-check-list" component={StockCheckList} />
                <Route exact path="/stock-check-actual" component={StockCheckActual} />

                {/* Router for the report function */}
                <Route exact path="/bao-cao-xuat" component={OutboundReport} />
                <Route exact path="/bao-cao-nhap" component={InBoundReport} />
                {/* <Route exact path="/bao-cao-ton-kho-theo-nhan-vien-phu-trach" component={InventoryPersoninCharge} /> */}
                {/* <Route exact path="/bao-cao-pallet" component={PalletReport} /> */}
                <Route exact path="/bao-cao-nhap-kho" component={ImportRatioCustomerReport} />
                <Route exact path="/bao-cao-xuat-kho" component={ExportRatioCustomerReport} />
                <Route exact path="/bao-cao-ton-kho" component={InventoryRatioCustomerReport} />
                <Route exact path="/bao-cao-ton-kho-theo-date" component={InventoryByDateReport} />
                <Route exact path="/bao-cao-ton-kho-theo-khach-hang" component={InventoryByCustomerReport} />
                <Route exact path="/bao-cao-ton-kho-theo-san-pham" component={InventoryByProduct} />
                <Route exact path="/bao-cao-san-pham-theo-vi-tri" component={ProductByLocation} />
                <Route exact path="/bao-cao-truy-cap-he-thong" component={LogModuleReport} />
                {/* Router for the setup customer */}
                <Route exact path="/khach-hang" component={Customer} />
                <Route exact path="/nha-cap-cap" component={ProviderAndCurator} />

                {/* Router for the setup product */}
                <Route exact path="/san-pham" component={Product} />
                <Route exact path="/nhom-san-pham" component={GroupProducts} />

                {/* Router for the setup attribute product */}
                <Route exact path="/thiet-lap-mau-sac" component={ProductAttributeColors} />
                <Route exact path="/thiet-lap-kich-thuoc" component={ProductAttributeDimensions} />
                <Route exact path="/thiet-lap-don-vi-tinh" component={ProductAttributeUnits} />

                {/* Router for the setup layout warehouse */}
                <Route exact path="/quan-ly-kho" component={WareHouse} />
                <Route exact path="/quan-ly-khu-vuc-kho" component={WareHouseArea} />
                <Route exact path="/quan-ly-ke" component={WareHouseShelve} />
                <Route exact path="/quan-ly-tang" component={WareHouseFloor} />
                <Route exact path="/quan-ly-location" component={WareHouseLocation} />
                <Route exact path="/quan-ly-pallet" component={WareHousePallet} />
                {/* <Route exact path="/quan-ly-group" component={WareHouseGroup} /> */}
                {/* <Route exact path="/ShowPass" component={ShowPass} /> */}
                
                {/* Router for the print product label */}
                <Route exact path="/quan-ly-in-ma-san-pham" component={Printproductlabel} />


            </Switch>
            <Route path="/" component={FooterMenu} />

        </BrowserRouter>
    );
}
