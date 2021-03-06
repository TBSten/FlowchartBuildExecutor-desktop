import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { resetItems } from "src/redux/items/actions";
import { resetMeta } from "src/redux/meta/actions";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { useTitle } from "src/redux/meta/operations";
import InputBase from "@mui/material/InputBase";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import {
    loadJson,
    storeStateToJson,
    saveToBrowser,
    resetBrowserSave,
} from "src/format";
import { downloadTextFile, getFileText } from "src/lib/file";
import ListItemIcon from "@mui/material/ListItemIcon";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import ZoomIn from "@mui/icons-material/ZoomIn";
import ZoomOut from "@mui/icons-material/ZoomOut";
import ImageIcon from "@mui/icons-material/Image";
import ConfirmDialog, { useConfirmDialog } from "../util/ConfirmDialog";
import { useChange, useMode, useZoom } from "src/redux/app/operations";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { donwloadImage } from "src/lib/image";
import Button from "@mui/material/Button";
import { ipcRenderer } from "electron";
// import { StoreState } from "src/redux/store";

export interface HeaderProps { }

const Header: FC<HeaderProps> = () => {
    const { isExistsChange } = useChange();
    return (
        <AppBar
            color="transparent"
            position="static"
            sx={{ zIndex: 1 }}
            elevation={0}
        >
            <Toolbar>
                <HeaderMenu />
                <Title />
            </Toolbar>
            <Toolbar sx={{
                width: "100%",
                overflow: "auto",
            }}>
                <Tools />
            </Toolbar>
        </AppBar >
    );
};
export default React.memo(Header);

const Title: FC<HeaderProps> = () => {
    const [title, setTitle] = useTitle();
    return (
        <InputBase
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ color: "inherit", flexGrow: 1 }}
        />
    );
};

const HeaderMenu: FC<{}> = () => {
    const [open, setOpen] = useState(false);
    const [title] = useTitle();
    const [confirm, dialogProps] = useConfirmDialog(
        "????????????????????????????????????????????????????????????????????????????????????????????????!"
    );
    const dispatch = useDispatch();
    const { resetChangeCount } = useChange();
    const handleSave = () => {
        setOpen(false);
        saveToBrowser();
        resetChangeCount();
    };
    const handleDownload = () => {
        setOpen(false);
        const saveFormat = storeStateToJson();
        downloadTextFile(saveFormat, title + ".fbe");
    };
    const handleImport = async () => {
        setOpen(false);
        const text = await getFileText();
        loadJson(JSON.parse(text));
    };
    const handleNew = () => {
        setOpen(false);
        //reset
        resetBrowserSave();
        dispatch(resetMeta());
        dispatch(resetItems());
        resetChangeCount();
    };
    const handleDownloadImage = () => {
        donwloadImage(title);
    };
    return (
        <>
            <IconButton color="inherit" onClick={() => setOpen(true)}>
                <MenuIcon />
            </IconButton>

            <Drawer open={open} onClose={() => setOpen(false)}>
                <Typography variant="h4" sx={{ px: 1, py: 2 }}>
                    Flowchart <br />
                    Build <br />
                    Executor
                </Typography>
                <List>
                    <ListItem button onClick={confirm}>
                        <ListItemIcon>
                            <FiberNewIcon />
                        </ListItemIcon>
                        ????????????
                    </ListItem>
                    <ListItem button onClick={handleSave}>
                        <ListItemIcon>
                            <SaveIcon />
                        </ListItemIcon>
                        ??????
                    </ListItem>

                    <ListItem button onClick={handleDownload}>
                        <ListItemIcon>
                            <CloudDownloadIcon />
                        </ListItemIcon>
                        ???????????????????????????
                    </ListItem>

                    <ListItem button onClick={handleImport}>
                        <ListItemIcon>
                            <CloudUploadIcon />
                        </ListItemIcon>
                        ???????????????
                    </ListItem>

                    <Divider />

                    <ListItem>
                        ??????????????????
                    </ListItem>

                    <ListItem button onClick={handleDownloadImage}>
                        <ListItemIcon>
                            <ImageIcon />
                        </ListItemIcon>
                        ?????????????????????????????????
                    </ListItem>

                </List>
            </Drawer>

            <ConfirmDialog {...dialogProps} onOk={handleNew} />
        </>
    );
};

const Tools: FC<{}> = () => {
    const { resetChangeCount, isExistsChange } = useChange();
    const [mode, setMode] = useMode();
    // const runtime = useSelector((state:StoreState)=>state.app.runtime);
    const [, , incZoom] = useZoom();
    const handleSave = () => {
        saveToBrowser();
        resetChangeCount();
    };
    const handleExecute = () => {
        if (mode === "edit") {
            setMode("execute");
        }
        if (mode === "execute") {
            // runtime?.executeNext();
            setMode("edit");
        }
    };
    const handleZoomIn = () => incZoom(+0.05);
    const handleZoomOut = () => incZoom(-0.05);
    return (
        <Toolbar >
            <Tooltip title="????????????">
                <IconButton onClick={handleSave}>
                    <Badge
                        variant={isExistsChange ? "dot" : "standard"}
                        color="primary"
                    >
                        <SaveIcon color="action" />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Tooltip title={mode === "execute" ? "????????????" : "????????????"}>
                <IconButton onClick={handleExecute}>
                    {mode === "execute" ?
                        <EditIcon />
                        :
                        <PlayArrowIcon />
                    }
                </IconButton>
            </Tooltip>
            <Tooltip title="??????">
                <IconButton onClick={handleZoomIn}>
                    <ZoomIn />
                </IconButton>
            </Tooltip>
            <Tooltip title="??????">
                <IconButton onClick={handleZoomOut}>
                    <ZoomOut />
                </IconButton>
            </Tooltip>
            <Button onClick={async () => { await window.myAPI.toggleDevTools() }}>
                dev tools
            </Button>
            <Button onClick={writeTest}>
                write test
            </Button>
            <Button onClick={readTest}>
                read test
            </Button>
        </Toolbar>
    );
};

async function writeTest() {
    const data = {
        name: "testfile.txt",
        data: "abcdefghijk",
    };
    const result = await window.myAPI.saveDataLocal(data);
    console.log(result);
}
async function readTest() {
    const data = await window.myAPI.loadDataLocal();
    console.log(data);
}

