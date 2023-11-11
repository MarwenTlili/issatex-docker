<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ArticleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Uid\Ulid;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\GetCollection;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
#[ApiResource]
#[ApiResource(
    uriTemplate: '/clients/{clientId}/articles', # used in "pwa/pages/manufacturing-orders/[id]/edit.tsx"
    uriVariables: [
        'clientId' => new Link(fromClass: Client::class, toProperty: 'client')
    ],
    operations: [new GetCollection()]
)]
class Article {
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[ORM\Column(length: 255)]
    private ?string $designation = null;

    #[ORM\Column(length: 255)]
    private ?string $model = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $composition = null;

    #[ORM\OneToMany(mappedBy: 'article', targetEntity: ManufacturingOrder::class)]
    private Collection $manufacturingOrders;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Client $client = null;

    public function __construct() {
        $this->manufacturingOrders = new ArrayCollection();
    }

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getDesignation(): ?string {
        return $this->designation;
    }

    public function setDesignation(string $designation): self {
        $this->designation = $designation;

        return $this;
    }

    public function getModel(): ?string {
        return $this->model;
    }

    public function setModel(string $model): self {
        $this->model = $model;

        return $this;
    }

    public function getComposition(): ?string {
        return $this->composition;
    }

    public function setComposition(?string $composition): self {
        $this->composition = $composition;

        return $this;
    }

    /**
     * @return Collection<int, ManufacturingOrder>
     */
    public function getManufacturingOrders(): Collection {
        return $this->manufacturingOrders;
    }

    public function addManufacturingOrder(ManufacturingOrder $manufacturingOrder): self {
        if (!$this->manufacturingOrders->contains($manufacturingOrder)) {
            $this->manufacturingOrders->add($manufacturingOrder);
            $manufacturingOrder->setArticle($this);
        }

        return $this;
    }

    public function removeManufacturingOrder(ManufacturingOrder $manufacturingOrder): self {
        if ($this->manufacturingOrders->removeElement($manufacturingOrder)) {
            // set the owning side to null (unless already changed)
            if ($manufacturingOrder->getArticle() === $this) {
                $manufacturingOrder->setArticle(null);
            }
        }

        return $this;
    }

    public function getClient(): ?Client {
        return $this->client;
    }

    public function setClient(?Client $client): self {
        $this->client = $client;

        return $this;
    }
}
