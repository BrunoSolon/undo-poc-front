import React, { useEffect, useState } from "react";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from '@material-ui/core/Snackbar';
import EditIcon from "@material-ui/icons/Edit";

import { Container, Wrapper, Box, ButtonDiv, InputBox } from "./styles";

import * as PersonActions from "../../store/actions/home";
import * as PersonSelectors from "../../store/reducers/home";

function Layout({
  person,
  getPerson,
  createPerson,
  deletePerson,
  canUndo,
  refreshPerson,
  onUndo,
  updatePerson,
  undoPast,
}) {
  const [payload, setPayload] = useState({
    name: "",
    age: "",
    job: "",
  });
  const [isEditing, setIsEditing] = useState({ edit: false, id: null });
  const [undoType, setUndoType] = useState(null);
  const [undoLayerId, setUndoLayerId] = useState(null);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  useEffect(() => {
    getPerson();
  }, []);

  useEffect(() => {
    if (messageInfo) {
      setOpen(true);
    }
  }, [messageInfo]);

  const openSnackbar = (msg) => {
    setMessageInfo({ message: msg });
  };

  const clickCreatePerson = async () => {
    if (isEditing.edit) {
      setUndoType('edit');

      let personCopy = [...person];
      let personEditIndex = personCopy.findIndex(p => p._id === isEditing.id);

      personCopy[personEditIndex] = { ...personCopy[personEditIndex], ...payload };
      refreshPerson(personCopy);
      setUndoLayerId(isEditing.id);
      
      updatePerson(isEditing.id, payload).then(() => {
        setIsEditing({ edit: false, id: null });
        openSnackbar("Camada editada com sucesso.");
      });
    } else {
      await createPerson(payload);
    }
  };

  const clickEdit = (id) => {
    const { name, age, job } = person.find((p) => p._id === id);
    setPayload({ name, age, job });
    setIsEditing({ edit: true, id });
  };

  const clickUndo = () => {
    onUndo();
    
    if(!undoLayerId) return;

    switch(undoType) {
      case 'delete':
        deletePerson(undoLayerId, false)
          .then(() => setUndoLayerId(null));
        break;

      case 'edit':
        const { age, job, name } = undoPast.find(p => p._id === undoLayerId);
        updatePerson(undoLayerId, { age, job, name })
          .then(() => setUndoLayerId(null));
        break;
    }

    setUndoType(null);
    UndoActionCreators.clearHistory();
    setOpen(false);
    setMessageInfo(undefined);
  };

  const clickDeletePerson = (id) => {
    setUndoType('delete');

    let personCopy = [...person];
    personCopy = personCopy.filter((person) => person._id !== id);
    refreshPerson(personCopy);
    setUndoLayerId(id);

    deletePerson(id, true).then(() => {
      openSnackbar("Camada excluída com sucesso.");
    }).catch(console.error);
  };

  const handleChange = (evt) => {
    setPayload({
      ...payload,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
    setUndoType(null);
    setUndoLayerId(null);
    UndoActionCreators.clearHistory();
  };

  return (
    <Container>
      <Wrapper>
        <InputBox>
          <form>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <TextField
                value={payload.name}
                id="outlined-basic"
                name="name"
                label="Nome"
                variant="filled"
                onChange={handleChange}
              />
              <TextField
                value={payload.job}
                id="outlined-basic2"
                label="Profissão"
                name="job"
                variant="filled"
                onChange={handleChange}
              />
              <TextField
                value={payload.age}
                id="outlined-basic3"
                name="age"
                label="Idade"
                variant="filled"
                onChange={handleChange}
              />
            </div>
          </form>
          <div style={{ display: "flex" }}>
            <Button
              onClick={clickCreatePerson}
              style={{ margin: "10px 5px" }}
              variant="contained"
              color="primary"
            >
              Salvar
            </Button>
          </div>
        </InputBox>
        <Box>
          {person?.map((p) => (
            <Paper
              key={p._id}
              elevation={3}
              style={{
                display: "flex",
                justifyContent: "space-between",
                minWidth: "400px",
                height: "130px",
                margin: "18px 0",
                padding: "10px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <strong>Nome:</strong>
                <p>{p.name}</p>
                <strong>Idade:</strong>
                <p>{p.age}</p>
                <strong>Profissão:</strong>
                <p>{p.job}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ButtonDiv key={0} onClick={() => clickDeletePerson(p._id)}>
                  <DeleteIcon />
                </ButtonDiv>
                <ButtonDiv key={1} onClick={() => clickEdit(p._id)}>
                  <EditIcon />
                </ButtonDiv>
              </div>
            </Paper>
          ))}
        </Box>
      </Wrapper>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        onExited={handleExited}
        message={messageInfo ? messageInfo.message : undefined}
        action={
          <>
            <Button disabled={!canUndo} color="secondary" size="small" onClick={clickUndo}>
              Desfazer
            </Button>
          </>
        }
      />
    </Container>
  );
}

const mapStateToProps = (state /*, ownProps*/) => ({
  person: PersonSelectors.getPerson(state),
  canUndo: PersonSelectors.canUndo(state),
  undoPast: PersonSelectors.getUndoPast(state),
});

const mapDispatchToProps = (dispatch) => ({
  getPerson: () => dispatch(PersonActions.getPerson()),
  createPerson: (payload) => dispatch(PersonActions.createPerson(payload)),
  updatePerson: (id, payload) => dispatch(PersonActions.updatePerson(id, payload)),
  deletePerson: (id, excluded) => dispatch(PersonActions.deletePerson(id, excluded)),
  savePerson: () => dispatch(PersonActions.savePerson()),
  refreshPerson: (person) => dispatch(PersonActions.savePerson(person)),
  onUndo: () => dispatch(UndoActionCreators.undo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
