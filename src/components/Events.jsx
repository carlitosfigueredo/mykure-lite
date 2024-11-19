import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  ButtonGroup,
} from '@mui/material';
import Swal from 'sweetalert2';
import { supabase } from '../supabaseConfig';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [openPersonForm, setOpenPersonForm] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [personData, setPersonData] = useState({
    person_name: '',
    person_lastname: '',
    person_ci: '',
    added_by: '',
  });
  const [userEmail, setUserEmail] = useState('');
  const [personId, setPersonId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
      setPersonData((prev) => ({ ...prev, added_by: user.email }));
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase.from('event').select('*');
      if (error) throw error;
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };

  const handleOpenPersonForm = (event) => {
    setSelectedEvent(event);
    setOpenPersonForm(true);
  };

  const handleClosePersonForm = () => {
    setOpenPersonForm(false);
    setOpenConfirmationDialog(false);
    setPersonId(null);
    setPersonData({
      person_name: '',
      person_lastname: '',
      person_ci: '',
      added_by: userEmail,
    });
  };

  const handlePersonChange = (e) => {
    const { name, value } = e.target;
    setPersonData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePerson = async () => {
    try {
      const { data: existingPerson, error: fetchError } = await supabase
        .from('person')
        .select('*')
        .eq('person_ci', personData.person_ci)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (existingPerson) {
        setPersonId(existingPerson.id);
        Swal.fire({
          icon: 'info',
          title: 'Persona encontrada',
          text: 'Esta persona ya está registrada. Puede continuar con el registro de asistencia.',
        });
      } else {
        const { data: newPerson, error: insertError } = await supabase
          .from('person')
          .insert([personData])
          .select()
          .single();

        if (insertError) throw insertError;

        setPersonId(newPerson.id);
      }

      setOpenConfirmationDialog(true);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar persona',
        text: error.message || 'Ocurrió un error inesperado.',
      });
    }
  };

  const handleRegisterAttendance = async () => {
    if (!selectedEvent || !personId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede registrar la asistencia sin un evento o persona válidos.',
      });
      return;
    }

    try {
      const { error } = await supabase.from('attendance').insert([
        {
          attendance_event_id: selectedEvent.id,
          attendance_person_id: personId,
          added_by: userEmail,
        },
      ]);

      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: 'Asistencia registrada',
        text: 'La asistencia se ha registrado correctamente.',
        timer: 3000,
        showConfirmButton: false,
      });

      handleClosePersonForm();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar asistencia',
        text: error.message,
      });
    }
  };

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 }, width: '100%' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Lista de Eventos
      </Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "primary.main", color: "white" }}>Nombre del Evento</TableCell>
              <TableCell sx={{ backgroundColor: "primary.main", color: "white" }}>Descripción</TableCell>
              <TableCell sx={{ backgroundColor: "primary.main", color: "white" }}>Fecha</TableCell>
              <TableCell sx={{ backgroundColor: "primary.main", color: "white" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.event_name}</TableCell>
                <TableCell>{event.event_short_description}</TableCell>
                <TableCell>{event.event_date}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleOpenPersonForm(event)}
                    >
                      Registrar persona
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => navigate(`/attendance/${event.id}`)}
                    >
                      Ver asistencia
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => navigate(`/draw/${event.id}`)}
                    >
                      Sorteos
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Formulario para guardar persona */}
      <Dialog open={openPersonForm} onClose={handleClosePersonForm} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6" align="center">
            Registrar Persona
          </Typography>
        </DialogTitle>
        <Box
          component="form"
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <DialogContent>
            <TextField
              label="Nombre"
              name="person_name"
              value={personData.person_name}
              onChange={handlePersonChange}
              required
              fullWidth
            />
            <TextField
              label="Apellido"
              name="person_lastname"
              value={personData.person_lastname}
              onChange={handlePersonChange}
              required
              fullWidth
            />
            <TextField
              label="Cédula"
              name="person_ci"
              value={personData.person_ci}
              onChange={handlePersonChange}
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Button variant="outlined" color="secondary" onClick={handleClosePersonForm} fullWidth>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSavePerson} fullWidth>
              Guardar Persona
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Confirmación de asistencia */}
      <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
        <DialogTitle>
          <Typography variant="h6" align="center">
            Confirmar Registro
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography align="center">
            ¿Registrar asistencia de {personData.person_name} {personData.person_lastname} al evento{' '}
            <strong>{selectedEvent?.event_name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={() => setOpenConfirmationDialog(false)} fullWidth>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleRegisterAttendance} fullWidth>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Events;
