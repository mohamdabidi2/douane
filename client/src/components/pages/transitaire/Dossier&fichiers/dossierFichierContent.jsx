import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  Stat,
  StatNumber,
  StatHelpText,
  StatArrow,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import { FaFolder, FaArrowUp, FaArrowDown, FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import EditPopup from './EditPopup';
import ViewPopup from './dossierviewer';
import DeletePopup from './deleteDossier';
import { format } from 'date-fns';

const FichiersDossiersContent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [viewDossier, setViewDossier] = useState(null);
  const [deleteDossier, setDeleteDossier] = useState(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [stats, setStats] = useState({ accepted: 0, refused: 0, total: 0 });

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé');
      return;
    }
    try {
      const [dossierResponse, statsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/dossier', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5000/api/stat/dossier', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setData(dossierResponse.data);
      setFilteredData(dossierResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, filterOption]);

  const handleSearch = () => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter((dossier) =>
        Object.values(dossier).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterOption) {
      filtered = filtered.filter((dossier) => {
        if (filterOption === 'import' || filterOption === 'export') {
          return dossier.typeDossier === filterOption;
        }
        if (filterOption === 'en-attente') {
          return dossier.etat === 'En attente';
        }
        return true;
      });
    }

    setFilteredData(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterOption('');
    setFilteredData(data);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const columns = React.useMemo(
    () => [
      { Header: 'ID Dossier', accessor: '_id' },
      { Header: 'Type', accessor: 'typeDossier' },
      { Header: 'Date de Soumission', accessor: 'dateDeSoumission', Cell: ({ value }) => formatDate(value) },
      { Header: 'Date limite', accessor: 'dateLimite', Cell: ({ value }) => formatDate(value) },
      {
        Header: 'Etat',
        accessor: 'etat',
        Cell: ({ value }) => {
          const bgColor =
            value === 'Accepté' ? 'green.200' : value === 'Refusé' ? 'red.200' : 'orange.200';
          return <Box bg={bgColor} p={2} borderRadius="md" textAlign="center">{value}</Box>;
        },
      },
      {
        Header: 'Action',
        accessor: '',
        Cell: ({ row }) => {
          const showEditDeleteIcons = row.original.etat === 'Refusé' || row.original.etat === 'En attente';
          return (
            <HStack spacing={3} justifyContent="flex-start">
              <Icon
                as={FaEye}
                w={5}
                h={5}
                cursor="pointer"
                color="teal.500"
                _hover={{ color: 'teal.700' }}
                onClick={() => {
                  setViewDossier(row.original);
                  onViewOpen();
                }}
              />
              {showEditDeleteIcons && (
                <>
                  <Icon
                    as={FaEdit}
                    w={5}
                    h={5}
                    cursor="pointer"
                    color="blue.500"
                    _hover={{ color: 'blue.700' }}
                    onClick={() => {
                      setSelectedDossier(row.original);
                      onEditOpen();
                    }}
                  />
                  <Icon
                    as={FaTrashAlt}
                    w={5}
                    h={5}
                    cursor="pointer"
                    color="red.500"
                    _hover={{ color: 'red.700' }}
                    onClick={() => {
                      setSelectedDossier(row.original);
                      onDeleteOpen();
                    }}
                  />
                </>
              )}
            </HStack>
          );
        },
      },
    ],
    [onEditOpen, onViewOpen, onDeleteOpen]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({ columns, data: filteredData }, usePagination);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/dossier/${selectedDossier._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchData();
      onDeleteClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <Box p={5}>
      <Flex mb={5} gap={5} wrap="wrap">
        <StatCard icon={FaFolder} title="Dossiers Acceptés" number={stats.accepted} arrowType="increase" arrowText="16% ce mois-ci" />
        <StatCard icon={FaFolder} title="Dossiers Refusés" number={stats.refused} arrowType="decrease" arrowText="1% ce mois-ci" />
        <StatCard icon={FaFolder} title="Tous les Dossiers" number={stats.total} />
      </Flex>

      <div style={{ background: "white", padding: "20px" }} className="tableaudesign">
        <Flex justify="space-between" mb={5} style={{ margin: "10px 0" }}>
          <VStack align="start">
            <Text fontSize="2xl" fontWeight="bold">Tous les Dossiers et les Fichiers</Text>
            <Text fontSize="md" color="gray.500">Dossiers en attente</Text>
          </VStack>
          <HStack>
            <Input
              placeholder="Search"
              size="md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button paddingInline={10} colorScheme={filterOption === 'import' ? 'blue' : 'gray'} onClick={() => setFilterOption('import')}>
              Import
            </Button>
            <Button paddingInline={10} colorScheme={filterOption === 'export' ? 'blue' : 'gray'} onClick={() => setFilterOption('export')}>
              Export
            </Button>

            <Button paddingInline={20} colorScheme="red" onClick={resetFilters}>
              Réinitialiser
            </Button>

          </HStack>
        </Flex>

        <TableContainer>
          <Table {...getTableProps()} variant="striped" colorScheme="gray">
            <Thead bg="gray.100">
              {headerGroups.map(headerGroup => (
                <Tr style={{ border: '1px solid gray' }} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <Th style={{ border: '1px solid gray' }} {...column.getHeaderProps()}>{column.render('Header')}</Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <Tr style={{ border: '1px solid gray' }} {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <Td style={{ border: '1px solid gray' }} {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>

        <Flex justify="space-between" mt={5} alignItems="center">
          <Text>Afficher des données 1 à {pageSize} sur {filteredData.length} entrées</Text>
          <HStack>
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </Button>
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </Button>
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} sur {pageOptions.length}
              </strong>{' '}
            </span>
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </Button>
            <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {'>>'}
            </Button>
          </HStack>
        </Flex>
      </div>

      {/* Delete Popup */}
      <DeletePopup
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onDelete={handleDelete}
      />

      {/* Edit Popup */}
      {selectedDossier && (
        <EditPopup
          isOpen={isEditOpen}
          fetchData={fetchData}
          onClose={onEditClose}
          dossier={selectedDossier}
        />
      )}

      {/* View Popup */}
      {viewDossier && (
        <ViewPopup
          isOpen={isViewOpen}
          onClose={onViewClose}
          dossier={viewDossier}
        />
      )}
    </Box>
  );
};

export default FichiersDossiersContent;

const StatCard = ({ icon, title, number, arrowType, arrowText }) => (
  <Stat p={4} bg="white" borderRadius="md" shadow="md" flex="1" minWidth="200px">
    <HStack>
      <Icon as={icon} w={8} h={8} color="blue.500" />
      <VStack align="start" spacing={1}>
        <StatNumber>{number}</StatNumber>
      </VStack>
    </HStack>
    <Text mt={2} fontWeight="bold">{title}</Text>
    {arrowType && (
      <StatHelpText>
        <StatArrow type={arrowType} />
        {arrowText}
      </StatHelpText>
    )}
  </Stat>
);
